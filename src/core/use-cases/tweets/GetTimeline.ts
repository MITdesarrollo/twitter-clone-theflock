import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

export interface GetTimelineInput {
  userId: string;
  cursor?: string;
  limit?: number;
}

export interface GetTimelineResult {
  tweets: PublicTweet[];
  nextCursor: string | null;
}

export class GetTimeline {
  constructor(private readonly tweetRepo: ITweetRepository) {}

  async execute(input: GetTimelineInput): Promise<GetTimelineResult> {
    const { tweets, nextCursor } = await this.tweetRepo.getTimeline(input.userId, {
      cursor: input.cursor,
      limit: input.limit,
    });
    return { tweets: tweets.map((t) => t.toPublic()), nextCursor };
  }
}
