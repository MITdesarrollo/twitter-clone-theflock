import type { PrismaClient } from '@/generated/prisma/client';
import type { ILikeRepository, ToggleLikeResult } from '@/core/use-cases/ports/ILikeRepository';

export class PrismaLikeRepository implements ILikeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async toggleLike(userId: string, tweetId: string): Promise<ToggleLikeResult> {
    const existing = await this.isLikedBy(userId, tweetId);

    if (existing) {
      await this.prisma.like.deleteMany({ where: { userId, tweetId } });
    } else {
      await this.prisma.like.create({ data: { userId, tweetId } });
    }

    const likeCount = await this.getLikeCount(tweetId);
    return { liked: !existing, likeCount };
  }

  async getLikeCount(tweetId: string): Promise<number> {
    return this.prisma.like.count({ where: { tweetId } });
  }

  async isLikedBy(userId: string, tweetId: string): Promise<boolean> {
    const record = await this.prisma.like.findUnique({
      where: { userId_tweetId: { userId, tweetId } },
    });
    return record !== null;
  }

  async getLikedTweetIds(userId: string, tweetIds: string[]): Promise<string[]> {
    if (tweetIds.length === 0) return [];
    const likes = await this.prisma.like.findMany({
      where: { userId, tweetId: { in: tweetIds } },
      select: { tweetId: true },
    });
    return likes.map((l) => l.tweetId);
  }
}
