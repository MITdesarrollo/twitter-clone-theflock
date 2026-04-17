import type { Tweet } from '@/core/domain/entities/Tweet';

export interface CreateTweetData {
  content: string;
  authorId: string;
  parentId?: string | null;
}

export interface PaginationOptions {
  cursor?: string;
  limit?: number;
}

export interface PaginatedTweets {
  tweets: Tweet[];
  nextCursor: string | null;
}

export interface ITweetRepository {
  create(data: CreateTweetData): Promise<Tweet>;
  findById(id: string): Promise<Tweet | null>;
  delete(id: string): Promise<void>;
  getTimeline(userId: string, options?: PaginationOptions): Promise<PaginatedTweets>;
  getByAuthor(authorId: string, options?: PaginationOptions): Promise<PaginatedTweets>;
  getReplies(tweetId: string, options?: PaginationOptions): Promise<PaginatedTweets>;
}
