import { describe, it, expect, vi } from 'vitest';
import { DeleteTweet } from '@/core/use-cases/tweets/DeleteTweet';
import { Tweet } from '@/core/domain/entities/Tweet';
import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';

const mockTweet = Tweet.create({
  id: 'tweet-1',
  content: 'Hello!',
  authorId: 'user-1',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

function createMockRepo(): ITweetRepository {
  return {
    create: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockTweet),
    delete: vi.fn().mockResolvedValue(undefined),
    getTimeline: vi.fn(),
    getByAuthor: vi.fn(),
    getReplies: vi.fn(),
  };
}

describe('DeleteTweet', () => {
  it('deletes own tweet', async () => {
    const repo = createMockRepo();
    const useCase = new DeleteTweet(repo);
    await useCase.execute({ tweetId: 'tweet-1', requestingUserId: 'user-1' });
    expect(repo.delete).toHaveBeenCalledWith('tweet-1');
  });

  it('throws Forbidden for non-owner', async () => {
    const repo = createMockRepo();
    const useCase = new DeleteTweet(repo);
    await expect(
      useCase.execute({ tweetId: 'tweet-1', requestingUserId: 'user-2' }),
    ).rejects.toThrow('Forbidden');
  });

  it('throws when tweet not found', async () => {
    const repo = createMockRepo();
    vi.mocked(repo.findById).mockResolvedValue(null);
    const useCase = new DeleteTweet(repo);
    await expect(
      useCase.execute({ tweetId: 'tweet-999', requestingUserId: 'user-1' }),
    ).rejects.toThrow('Tweet not found');
  });
});
