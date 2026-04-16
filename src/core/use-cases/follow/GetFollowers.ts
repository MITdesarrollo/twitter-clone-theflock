import type { IFollowRepository, PaginatedUsers } from '@/core/use-cases/ports/IFollowRepository';

export interface GetFollowersInput {
  userId: string;
  cursor?: string;
  limit?: number;
}

export class GetFollowers {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(input: GetFollowersInput): Promise<PaginatedUsers> {
    return this.followRepo.getFollowers(input.userId, {
      cursor: input.cursor,
      limit: input.limit,
    });
  }
}
