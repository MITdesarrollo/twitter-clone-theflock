import type { ILikeRepository, ToggleLikeResult } from '@/core/use-cases/ports/ILikeRepository';

export interface ToggleLikeInput {
  userId: string;
  tweetId: string;
}

export class ToggleLike {
  constructor(private readonly likeRepo: ILikeRepository) {}

  async execute(input: ToggleLikeInput): Promise<ToggleLikeResult> {
    return this.likeRepo.toggleLike(input.userId, input.tweetId);
  }
}
