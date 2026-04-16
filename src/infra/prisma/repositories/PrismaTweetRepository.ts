import type { PrismaClient } from '@/generated/prisma/client';
import type {
  ITweetRepository,
  CreateTweetData,
  PaginationOptions,
  PaginatedTweets,
} from '@/core/use-cases/ports/ITweetRepository';
import type { Tweet } from '@/core/domain/entities/Tweet';
import { TweetMapper } from '../mappers/TweetMapper';
import { encodeCursor, decodeCursor } from '@/lib/pagination';

const AUTHOR_SELECT = {
  select: { id: true, username: true, displayName: true, avatarUrl: true },
} as const;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export class PrismaTweetRepository implements ITweetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTweetData): Promise<Tweet> {
    const row = await this.prisma.tweet.create({
      data: { content: data.content, authorId: data.authorId, parentId: data.parentId ?? null },
      include: { author: AUTHOR_SELECT, _count: { select: { likes: true } } },
    });
    return TweetMapper.toDomain(row);
  }

  async findById(id: string): Promise<Tweet | null> {
    const row = await this.prisma.tweet.findUnique({
      where: { id },
      include: { author: AUTHOR_SELECT, _count: { select: { likes: true } } },
    });
    return row ? TweetMapper.toDomain(row) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tweet.delete({ where: { id } });
  }

  async getTimeline(userId: string, options?: PaginationOptions): Promise<PaginatedTweets> {
    const limit = Math.min(options?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options?.cursor ? decodeCursor(options.cursor) : null;

    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = [...follows.map((f) => f.followingId), userId];

    const rows = await this.prisma.tweet.findMany({
      where: {
        authorId: { in: followingIds },
        parentId: null,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      include: { author: AUTHOR_SELECT, _count: { select: { likes: true } } },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].id)
        : null;

    return { tweets: items.map(TweetMapper.toDomain), nextCursor };
  }

  async getByAuthor(authorId: string, options?: PaginationOptions): Promise<PaginatedTweets> {
    const limit = Math.min(options?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options?.cursor ? decodeCursor(options.cursor) : null;

    const rows = await this.prisma.tweet.findMany({
      where: {
        authorId,
        parentId: null,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      include: { author: AUTHOR_SELECT, _count: { select: { likes: true } } },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].id)
        : null;

    return { tweets: items.map(TweetMapper.toDomain), nextCursor };
  }
}
