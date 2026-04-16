import { describe, it, expect, beforeAll } from 'vitest';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-must-be-at-least-32-characters-long';
});

const service = new JoseAuthService();

const payload = {
  sub: 'user-123',
  username: 'alice',
  email: 'alice@example.com',
};

describe('JoseAuthService', () => {
  describe('signToken + verifyToken', () => {
    it('roundtrips a token', async () => {
      const token = await service.signToken(payload);
      expect(typeof token).toBe('string');
      const result = await service.verifyToken(token);
      expect(result).toEqual(payload);
    });

    it('returns null for invalid token', async () => {
      const result = await service.verifyToken('garbage.token.here');
      expect(result).toBeNull();
    });

    it('returns null for empty string', async () => {
      const result = await service.verifyToken('');
      expect(result).toBeNull();
    });

    it('throws when JWT_SECRET is missing on signToken', async () => {
      const original = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      await expect(service.signToken(payload)).rejects.toThrow(
        'JWT_SECRET environment variable is required',
      );
      process.env.JWT_SECRET = original;
    });

    it('returns null when JWT_SECRET is missing on verifyToken', async () => {
      const original = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      const result = await service.verifyToken('some.token.here');
      expect(result).toBeNull();
      process.env.JWT_SECRET = original;
    });
  });

  describe('hashPassword + comparePassword', () => {
    it('roundtrips a password', async () => {
      const hash = await service.hashPassword('MyPassword123');
      expect(hash).not.toBe('MyPassword123');
      const match = await service.comparePassword('MyPassword123', hash);
      expect(match).toBe(true);
    });

    it('rejects wrong password', async () => {
      const hash = await service.hashPassword('MyPassword123');
      const match = await service.comparePassword('WrongPassword1', hash);
      expect(match).toBe(false);
    });
  });
});
