import { describe, it, expect } from 'vitest';
import { Username } from '@/core/domain/value-objects/Username';

describe('Username', () => {
  it('creates a valid username', () => {
    const username = Username.create('alice_dev');
    expect(username.value).toBe('alice_dev');
  });

  it('trims whitespace', () => {
    const username = Username.create('  bob123  ');
    expect(username.value).toBe('bob123');
  });

  it('throws on empty string', () => {
    expect(() => Username.create('')).toThrow('Username is required');
  });

  it('throws on too short', () => {
    expect(() => Username.create('ab')).toThrow('at least 3 characters');
  });

  it('allows exactly 3 characters', () => {
    expect(Username.create('abc').value).toBe('abc');
  });

  it('allows exactly 20 characters', () => {
    expect(Username.create('a'.repeat(20)).value).toBe('a'.repeat(20));
  });

  it('throws on too long', () => {
    expect(() => Username.create('a'.repeat(21))).toThrow('at most 20 characters');
  });

  it('throws on special characters', () => {
    expect(() => Username.create('bad@name')).toThrow('letters, numbers, and underscores');
  });

  it('throws on spaces', () => {
    expect(() => Username.create('bad name')).toThrow('letters, numbers, and underscores');
  });
});
