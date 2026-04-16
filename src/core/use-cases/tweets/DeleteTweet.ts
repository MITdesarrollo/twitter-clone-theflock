import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';

export interface DeleteTweetInput {
  tweetId: string;
  requestingUserId: string;
}

export class DeleteTweet {
  constructor(private readonly tweetRepo: ITweetRepository) {}

  async execute(input: DeleteTweetInput): Promise<void> {
    const tweet = await this.tweetRepo.findById(input.tweetId);
    if (!tweet) throw new Error('Tweet not found');
    if (tweet.authorId !== input.requestingUserId) throw new Error('Forbidden');
    await this.tweetRepo.delete(input.tweetId);
  }
}
