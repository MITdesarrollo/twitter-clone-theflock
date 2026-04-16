import { describe, it, expect } from 'vitest';
import { Email } from '@/core/domain/value-objects/Email';

describe('Email', () => {
  it('creates a valid email', () => {
    const email = Email.create('User@Example.COM');
    expect(email.value).toBe('user@example.com');
  });

  it('trims whitespace', () => {
    const email = Email.create('  test@test.com  ');
    expect(email.value).toBe('test@test.com');
  });

  it('throws on empty string', () => {
    expect(() => Email.create('')).toThrow('Email is required');
  });

  it('throws on whitespace only', () => {
    expect(() => Email.create('   ')).toThrow('Email is required');
  });

  it('throws on invalid format', () => {
    expect(() => Email.create('not-an-email')).toThrow('Invalid email format');
  });

  it('throws on missing domain', () => {
    expect(() => Email.create('user@')).toThrow('Invalid email format');
  });

  it('throws on missing local part', () => {
    expect(() => Email.create('@domain.com')).toThrow('Invalid email format');
  });
});
