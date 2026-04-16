import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

export interface GetUserTweetsInput {
  authorId: string;
  cursor?: string;
  limit?: number;
}

export class GetUserTweets {
  constructor(private readonly tweetRepo: ITweetRepository) {}

  async execute(
    input: GetUserTweetsInput,
  ): Promise<{ tweets: PublicTweet[]; nextCursor: string | null }> {
    const { tweets, nextCursor } = await this.tweetRepo.getByAuthor(input.authorId, {
      cursor: input.cursor,
      limit: input.limit,
    });
    return { tweets: tweets.map((t) => t.toPublic()), nextCursor };
  }
}
