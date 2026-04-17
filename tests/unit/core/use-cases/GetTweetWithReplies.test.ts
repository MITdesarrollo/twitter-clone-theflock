import { describe, it, expect, vi } from 'vitest';
import { GetTweetWithReplies } from '@/core/use-cases/tweets/GetTweetWithReplies';
import { Tweet } from '@/core/domain/entities/Tweet';
import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';

const mockTweet = Tweet.create({
  id: 'tweet-1',
  content: 'Original tweet',
  authorId: 'user-1',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null },
});

const mockReply = Tweet.create({
  id: 'reply-1',
  content: 'A reply',
  authorId: 'user-2',
  parentId: 'tweet-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: 'user-2', username: 'bob', displayName: 'Bob', avatarUrl: null },
});

function createMockRepo(): ITweetRepository {
  return {
    create: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockTweet),
    delete: vi.fn(),
    getTimeline: vi.fn(),
    getByAuthor: vi.fn(),
    getReplies: vi.fn().mockResolvedValue({ tweets: [mockReply], nextCursor: null }),
  };
}

describe('GetTweetWithReplies', () => {
  it('returns tweet with replies', async () => {
    const repo = createMockRepo();
    const uc = new GetTweetWithReplies(repo);
    const result = await uc.execute({ tweetId: 'tweet-1' });
    expect(result).not.toBeNull();
    expect(result!.tweet.id).toBe('tweet-1');
    expect(result!.replies).toHaveLength(1);
    expect(result!.replies[0].parentId).toBe('tweet-1');
  });

  it('returns null when tweet not found', async () => {
    const repo = createMockRepo();
    vi.mocked(repo.findById).mockResolvedValue(null);
    const uc = new GetTweetWithReplies(repo);
    const result = await uc.execute({ tweetId: 'nonexistent' });
    expect(result).toBeNull();
  });

  it('returns empty replies', async () => {
    const repo = createMockRepo();
    vi.mocked(repo.getReplies).mockResolvedValue({ tweets: [], nextCursor: null });
    const uc = new GetTweetWithReplies(repo);
    const result = await uc.execute({ tweetId: 'tweet-1' });
    expect(result!.replies).toHaveLength(0);
    expect(result!.nextCursor).toBeNull();
  });
});
