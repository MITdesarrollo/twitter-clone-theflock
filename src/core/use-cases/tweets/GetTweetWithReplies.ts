import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

export interface GetTweetWithRepliesInput {
  tweetId: string;
  cursor?: string;
  limit?: number;
}

export interface GetTweetWithRepliesResult {
  tweet: PublicTweet;
  replies: PublicTweet[];
  nextCursor: string | null;
}

export class GetTweetWithReplies {
  constructor(private readonly tweetRepo: ITweetRepository) {}

  async execute(input: GetTweetWithRepliesInput): Promise<GetTweetWithRepliesResult | null> {
    const tweet = await this.tweetRepo.findById(input.tweetId);
    if (!tweet) return null;

    const { tweets: replies, nextCursor } = await this.tweetRepo.getReplies(input.tweetId, {
      cursor: input.cursor,
      limit: input.limit,
    });

    return {
      tweet: tweet.toPublic(),
      replies: replies.map((r) => r.toPublic()),
      nextCursor,
    };
  }
}
