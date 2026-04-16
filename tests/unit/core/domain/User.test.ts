import { describe, it, expect } from 'vitest';
import { User } from '@/core/domain/entities/User';

const validProps = {
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  displayName: 'Alice Dev',
  bio: 'Hello world',
  avatarUrl: null,
  passwordHash: 'hashed-password',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('User', () => {
  it('creates a user with all properties', () => {
    const user = User.create(validProps);
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('alice@example.com');
    expect(user.username).toBe('alice');
    expect(user.displayName).toBe('Alice Dev');
    expect(user.bio).toBe('Hello world');
    expect(user.avatarUrl).toBeNull();
    expect(user.passwordHash).toBe('hashed-password');
  });

  it('returns null for undefined bio', () => {
    const user = User.create({ ...validProps, bio: undefined });
    expect(user.bio).toBeNull();
  });

  it('toPublic excludes passwordHash', () => {
    const user = User.create(validProps);
    const publicUser = user.toPublic();
    expect(publicUser).not.toHaveProperty('passwordHash');
    expect(publicUser).not.toHaveProperty('updatedAt');
    expect(publicUser.id).toBe('user-1');
    expect(publicUser.email).toBe('alice@example.com');
    expect(publicUser.displayName).toBe('Alice Dev');
  });
});
