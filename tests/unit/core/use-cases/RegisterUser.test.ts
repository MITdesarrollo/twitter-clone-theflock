import { describe, it, expect, vi } from 'vitest';
import { RegisterUser } from '@/core/use-cases/auth/RegisterUser';
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
    findByEmail: vi.fn().mockResolvedValue(null),
    findByUsername: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(mockUser),
  };
  const authService: IAuthService = {
    signToken: vi.fn().mockResolvedValue('jwt-token'),
    verifyToken: vi.fn().mockResolvedValue(null),
    hashPassword: vi.fn().mockResolvedValue('hashed'),
    comparePassword: vi.fn().mockResolvedValue(true),
  };
  return { userRepo, authService };
}

const validInput = {
  email: 'alice@example.com',
  username: 'alice',
  displayName: 'Alice',
  password: 'SecurePass1',
};

describe('RegisterUser', () => {
  it('registers successfully', async () => {
    const { userRepo, authService } = createMocks();
    const useCase = new RegisterUser(userRepo, authService);
    const result = await useCase.execute(validInput);
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.token).toBe('jwt-token');
    expect(userRepo.create).toHaveBeenCalledOnce();
    expect(authService.hashPassword).toHaveBeenCalledWith('SecurePass1');
  });

  it('throws on duplicate email', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(userRepo.findByEmail).mockResolvedValue(mockUser);
    const useCase = new RegisterUser(userRepo, authService);
    await expect(useCase.execute(validInput)).rejects.toThrow('Email already in use');
  });

  it('throws on duplicate username', async () => {
    const { userRepo, authService } = createMocks();
    vi.mocked(userRepo.findByUsername).mockResolvedValue(mockUser);
    const useCase = new RegisterUser(userRepo, authService);
    await expect(useCase.execute(validInput)).rejects.toThrow('Username already taken');
  });

  it('throws on invalid email', async () => {
    const { userRepo, authService } = createMocks();
    const useCase = new RegisterUser(userRepo, authService);
    await expect(useCase.execute({ ...validInput, email: 'bad' })).rejects.toThrow(
      'Invalid email format',
    );
  });

  it('throws on weak password', async () => {
    const { userRepo, authService } = createMocks();
    const useCase = new RegisterUser(userRepo, authService);
    await expect(useCase.execute({ ...validInput, password: 'weak' })).rejects.toThrow(
      'at least 8 characters',
    );
  });
});
