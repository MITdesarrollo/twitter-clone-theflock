import { describe, it, expect, vi } from 'vitest';
import { ToggleFollow } from '@/core/use-cases/follow/ToggleFollow';
import type { IFollowRepository } from '@/core/use-cases/ports/IFollowRepository';

function createMockRepo(isFollowing = false): IFollowRepository {
  return {
    follow: vi.fn().mockResolvedValue(undefined),
    unfollow: vi.fn().mockResolvedValue(undefined),
    isFollowing: vi.fn().mockResolvedValue(isFollowing),
    getFollowers: vi.fn(),
    getFollowing: vi.fn(),
    getFollowCounts: vi.fn(),
  };
}

describe('ToggleFollow', () => {
  it('follows when not yet following', async () => {
    const repo = createMockRepo(false);
    const uc = new ToggleFollow(repo);
    const result = await uc.execute({ followerId: 'user-1', followingId: 'user-2' });
    expect(result.following).toBe(true);
    expect(repo.follow).toHaveBeenCalledWith('user-1', 'user-2');
    expect(repo.unfollow).not.toHaveBeenCalled();
  });

  it('unfollows when already following', async () => {
    const repo = createMockRepo(true);
    const uc = new ToggleFollow(repo);
    const result = await uc.execute({ followerId: 'user-1', followingId: 'user-2' });
    expect(result.following).toBe(false);
    expect(repo.unfollow).toHaveBeenCalledWith('user-1', 'user-2');
    expect(repo.follow).not.toHaveBeenCalled();
  });

  it('throws when following yourself', async () => {
    const repo = createMockRepo();
    const uc = new ToggleFollow(repo);
    await expect(uc.execute({ followerId: 'user-1', followingId: 'user-1' })).rejects.toThrow(
      'Cannot follow yourself',
    );
  });
});
