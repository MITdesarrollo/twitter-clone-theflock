import type { IFollowRepository, FollowCounts } from '@/core/use-cases/ports/IFollowRepository';

export interface GetFollowStatusInput {
  profileUserId: string;
  currentUserId?: string;
}

export interface GetFollowStatusResult extends FollowCounts {
  isFollowing: boolean;
}

export class GetFollowStatus {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(input: GetFollowStatusInput): Promise<GetFollowStatusResult> {
    const [counts, isFollowing] = await Promise.all([
      this.followRepo.getFollowCounts(input.profileUserId),
      input.currentUserId
        ? this.followRepo.isFollowing(input.currentUserId, input.profileUserId)
        : Promise.resolve(false),
    ]);
    return { ...counts, isFollowing };
  }
}
