import { describe, it, expect, vi } from 'vitest';
import { ToggleLike } from '@/core/use-cases/likes/ToggleLike';
import type { ILikeRepository } from '@/core/use-cases/ports/ILikeRepository';

function createMockRepo(toggleResult = { liked: true, likeCount: 1 }): ILikeRepository {
  return {
    toggleLike: vi.fn().mockResolvedValue(toggleResult),
    getLikeCount: vi.fn().mockResolvedValue(0),
    isLikedBy: vi.fn().mockResolvedValue(false),
    getLikedTweetIds: vi.fn().mockResolvedValue([]),
  };
}

describe('ToggleLike', () => {
  it('returns liked=true when liking', async () => {
    const repo = createMockRepo({ liked: true, likeCount: 1 });
    const uc = new ToggleLike(repo);
    const result = await uc.execute({ userId: 'user-1', tweetId: 'tweet-1' });
    expect(result.liked).toBe(true);
    expect(result.likeCount).toBe(1);
    expect(repo.toggleLike).toHaveBeenCalledWith('user-1', 'tweet-1');
  });

  it('returns liked=false when unliking', async () => {
    const repo = createMockRepo({ liked: false, likeCount: 0 });
    const uc = new ToggleLike(repo);
    const result = await uc.execute({ userId: 'user-1', tweetId: 'tweet-1' });
    expect(result.liked).toBe(false);
    expect(result.likeCount).toBe(0);
  });

  it('calls repo with correct arguments', async () => {
    const repo = createMockRepo();
    const uc = new ToggleLike(repo);
    await uc.execute({ userId: 'user-A', tweetId: 'tweet-B' });
    expect(repo.toggleLike).toHaveBeenCalledWith('user-A', 'tweet-B');
  });
});
