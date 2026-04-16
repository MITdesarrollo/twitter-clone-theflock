import type { IFollowRepository } from '@/core/use-cases/ports/IFollowRepository';

export interface ToggleFollowInput {
  followerId: string;
  followingId: string;
}

export interface ToggleFollowResult {
  following: boolean;
}

export class ToggleFollow {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(input: ToggleFollowInput): Promise<ToggleFollowResult> {
    if (input.followerId === input.followingId) {
      throw new Error('Cannot follow yourself');
    }
    const isFollowing = await this.followRepo.isFollowing(input.followerId, input.followingId);
    if (isFollowing) {
      await this.followRepo.unfollow(input.followerId, input.followingId);
      return { following: false };
    } else {
      await this.followRepo.follow(input.followerId, input.followingId);
      return { following: true };
    }
  }
}
