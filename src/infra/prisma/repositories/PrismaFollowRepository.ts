import type { PrismaClient } from '@/generated/prisma/client';
import type {
  IFollowRepository,
  FollowPaginationOptions,
  PaginatedUsers,
  FollowCounts,
} from '@/core/use-cases/ports/IFollowRepository';
import { UserMapper } from '../mappers/UserMapper';
import { encodeCursor, decodeCursor } from '@/lib/pagination';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export class PrismaFollowRepository implements IFollowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const record = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return record !== null;
  }

  async getFollowers(userId: string, options?: FollowPaginationOptions): Promise<PaginatedUsers> {
    const limit = Math.min(options?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options?.cursor ? decodeCursor(options.cursor) : null;

    const rows = await this.prisma.follow.findMany({
      where: {
        followingId: userId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, followerId: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { followerId: 'desc' }],
      take: limit + 1,
      include: { follower: true },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].followerId)
        : null;

    return {
      users: items.map((r) => UserMapper.toDomain(r.follower).toPublic()),
      nextCursor,
    };
  }

  async getFollowing(userId: string, options?: FollowPaginationOptions): Promise<PaginatedUsers> {
    const limit = Math.min(options?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options?.cursor ? decodeCursor(options.cursor) : null;

    const rows = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, followingId: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { followingId: 'desc' }],
      take: limit + 1,
      include: { following: true },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].followingId)
        : null;

    return {
      users: items.map((r) => UserMapper.toDomain(r.following).toPublic()),
      nextCursor,
    };
  }

  async getFollowCounts(userId: string): Promise<FollowCounts> {
    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);
    return { followersCount, followingCount };
  }
}
