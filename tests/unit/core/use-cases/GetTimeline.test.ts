import { describe, it, expect, vi } from 'vitest';
import { GetTimeline } from '@/core/use-cases/tweets/GetTimeline';
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
    create: vi.fn(),
    findById: vi.fn(),
    delete: vi.fn(),
    getTimeline: vi.fn().mockResolvedValue({ tweets: [mockTweet], nextCursor: null }),
    getByAuthor: vi.fn(),
  };
}

describe('GetTimeline', () => {
  it('returns tweets as PublicTweet[]', async () => {
    const repo = createMockRepo();
    const useCase = new GetTimeline(repo);
    const result = await useCase.execute({ userId: 'user-1' });
    expect(result.tweets).toHaveLength(1);
    expect(result.tweets[0].author?.username).toBe('alice');
    expect(result.nextCursor).toBeNull();
  });

  it('returns empty timeline', async () => {
    const repo = createMockRepo();
    vi.mocked(repo.getTimeline).mockResolvedValue({ tweets: [], nextCursor: null });
    const useCase = new GetTimeline(repo);
    const result = await useCase.execute({ userId: 'user-1' });
    expect(result.tweets).toHaveLength(0);
  });
});
