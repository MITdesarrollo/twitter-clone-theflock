import { Tweet } from '@/core/domain/entities/Tweet';
import type { Tweet as PrismaTweet, User as PrismaUser } from '@/generated/prisma/client';

type PrismaTweetWithAuthor = PrismaTweet & {
  author?: Pick<PrismaUser, 'id' | 'username' | 'displayName' | 'avatarUrl'> | null;
  _count?: { likes: number } | null;
};

export class TweetMapper {
  static toDomain(row: PrismaTweetWithAuthor): Tweet {
    return Tweet.create({
      id: row.id,
      content: row.content,
      authorId: row.authorId,
      parentId: row.parentId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: row.author ?? undefined,
      likeCount: row._count?.likes ?? 0,
    });
  }
}
