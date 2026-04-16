import type { IFollowRepository, PaginatedUsers } from '@/core/use-cases/ports/IFollowRepository';

export interface GetFollowingInput {
  userId: string;
  cursor?: string;
  limit?: number;
}

export class GetFollowing {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(input: GetFollowingInput): Promise<PaginatedUsers> {
    return this.followRepo.getFollowing(input.userId, {
      cursor: input.cursor,
      limit: input.limit,
    });
  }
}
