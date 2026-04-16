import { describe, it, expect, vi } from 'vitest';
import { GetFollowStatus } from '@/core/use-cases/follow/GetFollowStatus';
import type { IFollowRepository } from '@/core/use-cases/ports/IFollowRepository';

function createMockRepo(isFollowing = false): IFollowRepository {
  return {
    follow: vi.fn(),
    unfollow: vi.fn(),
    isFollowing: vi.fn().mockResolvedValue(isFollowing),
    getFollowers: vi.fn(),
    getFollowing: vi.fn(),
    getFollowCounts: vi.fn().mockResolvedValue({ followersCount: 10, followingCount: 5 }),
  };
}

describe('GetFollowStatus', () => {
  it('returns counts and isFollowing=true when user follows profile', async () => {
    const repo = createMockRepo(true);
    const uc = new GetFollowStatus(repo);
    const result = await uc.execute({ profileUserId: 'user-2', currentUserId: 'user-1' });
    expect(result.isFollowing).toBe(true);
    expect(result.followersCount).toBe(10);
    expect(result.followingCount).toBe(5);
  });

  it('returns isFollowing=false when not authenticated', async () => {
    const repo = createMockRepo();
    const uc = new GetFollowStatus(repo);
    const result = await uc.execute({ profileUserId: 'user-2', currentUserId: undefined });
    expect(result.isFollowing).toBe(false);
    expect(repo.isFollowing).not.toHaveBeenCalled();
  });

  it('returns isFollowing=false when user does not follow', async () => {
    const repo = createMockRepo(false);
    const uc = new GetFollowStatus(repo);
    const result = await uc.execute({ profileUserId: 'user-2', currentUserId: 'user-1' });
    expect(result.isFollowing).toBe(false);
  });
});
