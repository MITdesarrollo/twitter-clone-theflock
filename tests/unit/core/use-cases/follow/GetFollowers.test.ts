import { describe, it, expect, vi } from 'vitest';
import { GetFollowers } from '@/core/use-cases/follow/GetFollowers';
import type { IFollowRepository } from '@/core/use-cases/ports/IFollowRepository';

function createMockRepo(
  users: unknown[] = [],
  nextCursor: string | null = null,
): IFollowRepository {
  return {
    follow: vi.fn(),
    unfollow: vi.fn(),
    isFollowing: vi.fn(),
    getFollowers: vi.fn().mockResolvedValue({ users, nextCursor }),
    getFollowing: vi.fn(),
    getFollowCounts: vi.fn(),
  };
}

describe('GetFollowers', () => {
  it('returns paginated followers', async () => {
    const mockUser = {
      id: 'u2',
      username: 'alice',
      displayName: 'Alice',
      bio: null,
      avatarUrl: null,
      email: 'a@t.com',
      createdAt: new Date(),
    };
    const repo = createMockRepo([mockUser]);
    const uc = new GetFollowers(repo);
    const result = await uc.execute({ userId: 'user-1' });
    expect(result.users).toHaveLength(1);
    expect(result.nextCursor).toBeNull();
  });

  it('returns empty list', async () => {
    const repo = createMockRepo([]);
    const uc = new GetFollowers(repo);
    const result = await uc.execute({ userId: 'user-1' });
    expect(result.users).toHaveLength(0);
  });
});
