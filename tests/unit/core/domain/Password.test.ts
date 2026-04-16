import { describe, it, expect } from 'vitest';
import { Password } from '@/core/domain/value-objects/Password';

describe('Password', () => {
  it('creates a valid password', () => {
    const password = Password.create('SecurePass1');
    expect(password.value).toBe('SecurePass1');
  });

  it('throws on empty string', () => {
    expect(() => Password.create('')).toThrow('Password is required');
  });

  it('throws on too short', () => {
    expect(() => Password.create('Sh0rt')).toThrow('at least 8 characters');
  });

  it('throws on no uppercase', () => {
    expect(() => Password.create('nouppercase1')).toThrow('one uppercase letter');
  });

  it('throws on no lowercase', () => {
    expect(() => Password.create('NOLOWERCASE1')).toThrow('one lowercase letter');
  });

  it('throws on no digit', () => {
    expect(() => Password.create('NoDigitHere')).toThrow('one digit');
  });

  it('allows exactly 8 characters', () => {
    expect(Password.create('Abcdefg1').value).toBe('Abcdefg1');
  });
});
