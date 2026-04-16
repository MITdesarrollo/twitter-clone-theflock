import { describe, it, expect, vi } from 'vitest';
import { LoginUser } from '@/core/use-cases/auth/LoginUser';
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
    findById: vi.fn().mockResolvedValue(null),
    findByEmail: vi.fn().mockResolvedValue(mockUser),
    findByUsername: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
  };
  const authService: IAuthService = {
    signToken: vi.fn().mockResolvedValue('jwt-token'),
    verifyToken: vi.fn().mockResolvedValue(null),
    hashPassword: vi.fn(),
    comparePassword: vi.fn().mockResolvedValue(true),
  };
  return { userRepo, authService };
}

describe('LoginUser', () => {
  it('logs in successfully', async () => {
    const { userRepo, authService } = createMocks();
    const useCase = new LoginUser(userRepo, authService);
    const result = await useCase.execute({ email: 'alice@example.com', password: 'SecurePass1' });
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.token).toBe('jwt-token');
  });

  it('throws on user not found', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(userRepo.findByEmail).mockResolvedValue(null);
    const useCase = new LoginUser(userRepo, authService);
    await expect(
      useCase.execute({ email: 'unknown@example.com', password: 'SecurePass1' }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('throws on wrong password', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(authService.comparePassword).mockResolvedValue(false);
    const useCase = new LoginUser(userRepo, authService);
    await expect(
      useCase.execute({ email: 'alice@example.com', password: 'WrongPass1' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
