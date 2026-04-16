import { describe, it, expect, vi } from 'vitest';
import { SearchUsers } from '@/core/use-cases/search/SearchUsers';
import { User } from '@/core/domain/entities/User';
import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';

const mockUser = User.create({
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  displayName: 'Alice Dev',
  bio: null,
  avatarUrl: null,
  passwordHash: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
});

function createMockRepo(searchResult: User[] = []): IUserRepository {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    create: vi.fn(),
    search: vi.fn().mockResolvedValue(searchResult),
  };
}

describe('SearchUsers', () => {
  it('returns matching users as PublicUser', async () => {
    const repo = createMockRepo([mockUser]);
    const uc = new SearchUsers(repo);
    const result = await uc.execute({ query: 'alice' });
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('alice');
    expect(result[0]).not.toHaveProperty('passwordHash');
  });

  it('returns empty array for empty query', async () => {
    const repo = createMockRepo();
    const uc = new SearchUsers(repo);
    const result = await uc.execute({ query: '' });
    expect(result).toHaveLength(0);
    expect(repo.search).not.toHaveBeenCalled();
  });

  it('returns empty array for whitespace-only query', async () => {
    const repo = createMockRepo();
    const uc = new SearchUsers(repo);
    const result = await uc.execute({ query: '   ' });
    expect(result).toHaveLength(0);
  });

  it('trims query before searching', async () => {
    const repo = createMockRepo([]);
    const uc = new SearchUsers(repo);
    await uc.execute({ query: '  alice  ' });
    expect(repo.search).toHaveBeenCalledWith('alice', undefined);
  });
});
