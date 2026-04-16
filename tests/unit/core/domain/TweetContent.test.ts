import { describe, it, expect } from 'vitest';
import { TweetContent } from '@/core/domain/value-objects/TweetContent';

describe('TweetContent', () => {
  it('creates valid content', () => {
    const content = TweetContent.create('Hello world!');
    expect(content.value).toBe('Hello world!');
  });

  it('trims whitespace', () => {
    const content = TweetContent.create('  hello  ');
    expect(content.value).toBe('hello');
  });

  it('throws on empty string', () => {
    expect(() => TweetContent.create('')).toThrow('Tweet content is required');
  });

  it('throws on whitespace only', () => {
    expect(() => TweetContent.create('   ')).toThrow('Tweet content is required');
  });

  it('allows exactly 280 characters', () => {
    const text = 'a'.repeat(280);
    expect(TweetContent.create(text).value).toBe(text);
  });

  it('throws on 281 characters', () => {
    const text = 'a'.repeat(281);
    expect(() => TweetContent.create(text)).toThrow('280 characters or less');
  });
});
