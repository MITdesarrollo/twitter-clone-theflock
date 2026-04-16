import { describe, it, expect, vi } from 'vitest';
import { GetFollowing } from '@/core/use-cases/follow/GetFollowing';
import type { IFollowRepository } from '@/core/use-cases/ports/IFollowRepository';

function createMockRepo(
  users: unknown[] = [],
  nextCursor: string | null = null,
): IFollowRepository {
  return {
    follow: vi.fn(),
    unfollow: vi.fn(),
    isFollowing: vi.fn(),
    getFollowers: vi.fn(),
    getFollowing: vi.fn().mockResolvedValue({ users, nextCursor }),
    getFollowCounts: vi.fn(),
  };
}

describe('GetFollowing', () => {
  it('returns paginated following list', async () => {
    const mockUser = {
      id: 'u3',
      username: 'bob',
      displayName: 'Bob',
      bio: null,
      avatarUrl: null,
      email: 'b@t.com',
      createdAt: new Date(),
    };
    const repo = createMockRepo([mockUser]);
    const uc = new GetFollowing(repo);
    const result = await uc.execute({ userId: 'user-1' });
    expect(result.users).toHaveLength(1);
  });

  it('returns empty list', async () => {
    const repo = createMockRepo([]);
    const uc = new GetFollowing(repo);
    const result = await uc.execute({ userId: 'user-1' });
    expect(result.users).toHaveLength(0);
  });
});
