import { describe, it, expect, vi } from 'vitest';
import { CreateTweet } from '@/core/use-cases/tweets/CreateTweet';
import { Tweet } from '@/core/domain/entities/Tweet';
import type { ITweetRepository } from '@/core/use-cases/ports/ITweetRepository';

const mockTweet = Tweet.create({
  id: 'tweet-1',
  content: 'Hello!',
  authorId: 'user-1',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null },
});

function createMockRepo(): ITweetRepository {
  return {
    create: vi.fn().mockResolvedValue(mockTweet),
    findById: vi.fn(),
    delete: vi.fn(),
    getTimeline: vi.fn(),
    getByAuthor: vi.fn(),
    getReplies: vi.fn(),
  };
}

describe('CreateTweet', () => {
  it('creates a tweet successfully', async () => {
    const repo = createMockRepo();
    const useCase = new CreateTweet(repo);
    const result = await useCase.execute({ authorId: 'user-1', content: 'Hello!' });
    expect(result.id).toBe('tweet-1');
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it('throws on empty content', async () => {
    const repo = createMockRepo();
    const useCase = new CreateTweet(repo);
    await expect(useCase.execute({ authorId: 'user-1', content: '' })).rejects.toThrow(
      'Tweet content is required',
    );
  });

  it('throws on content over 280 chars', async () => {
    const repo = createMockRepo();
    const useCase = new CreateTweet(repo);
    await expect(useCase.execute({ authorId: 'user-1', content: 'a'.repeat(281) })).rejects.toThrow(
      '280 characters or less',
    );
  });
});
