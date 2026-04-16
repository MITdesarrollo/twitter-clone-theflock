import { describe, it, expect, vi } from 'vitest';
import { GetCurrentUser } from '@/core/use-cases/auth/GetCurrentUser';
import { User } from '@/core/domain/entities/User';
import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';
import type { IAuthService } from '@/core/use-cases/ports/IAuthService';

const mockUser = User.create({
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  displayName: 'Alice',
  bio: null,
  avatarUrl: null,
  passwordHash: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
});

function createMocks() {
  const userRepo: IUserRepository = {
    findById: vi.fn().mockResolvedValue(mockUser),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    create: vi.fn(),
  };
  const authService: IAuthService = {
    signToken: vi.fn(),
    verifyToken: vi
      .fn()
      .mockResolvedValue({ sub: 'user-1', username: 'alice', email: 'alice@example.com' }),
    hashPassword: vi.fn(),
    comparePassword: vi.fn(),
  };
  return { userRepo, authService };
}

describe('GetCurrentUser', () => {
  it('returns user for valid token', async () => {
    const { userRepo, authService } = createMocks();
    const useCase = new GetCurrentUser(userRepo, authService);
    const result = await useCase.execute('valid-token');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('user-1');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('returns null for invalid token', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(authService.verifyToken).mockResolvedValue(null);
    const useCase = new GetCurrentUser(userRepo, authService);
    const result = await useCase.execute('bad-token');
    expect(result).toBeNull();
  });

  it('returns null when user not found', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(userRepo.findById).mockResolvedValue(null);
    const useCase = new GetCurrentUser(userRepo, authService);
    const result = await useCase.execute('valid-token');
    expect(result).toBeNull();
  });
});
