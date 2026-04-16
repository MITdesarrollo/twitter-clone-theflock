import { TweetContent } from '@/core/domain/value-objects/TweetContent';
import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

export interface CreateTweetInput {
  authorId: string;
  content: string;
}

export class CreateTweet {
  constructor(private readonly tweetRepo: ITweetRepository) {}

  async execute(input: CreateTweetInput): Promise<PublicTweet> {
    const content = TweetContent.create(input.content);
    const tweet = await this.tweetRepo.create({
      content: content.value,
      authorId: input.authorId,
      parentId: null,
    });
    return tweet.toPublic();
  }
}
