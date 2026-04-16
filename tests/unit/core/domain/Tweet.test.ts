import { describe, it, expect } from 'vitest';
import { Tweet } from '@/core/domain/entities/Tweet';

const validProps = {
  id: 'tweet-1',
  content: 'Hello world!',
  authorId: 'user-1',
  parentId: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  author: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null },
};

describe('Tweet', () => {
  it('creates a tweet with all properties', () => {
    const tweet = Tweet.create(validProps);
    expect(tweet.id).toBe('tweet-1');
    expect(tweet.content).toBe('Hello world!');
    expect(tweet.authorId).toBe('user-1');
    expect(tweet.parentId).toBeNull();
    expect(tweet.author?.username).toBe('alice');
  });

  it('toPublic returns correct shape', () => {
    const tweet = Tweet.create(validProps);
    const pub = tweet.toPublic();
    expect(pub.id).toBe('tweet-1');
    expect(pub.author?.displayName).toBe('Alice');
    expect(pub).toHaveProperty('updatedAt');
  });

  it('toPublic returns null author when not provided', () => {
    const tweet = Tweet.create({ ...validProps, author: undefined });
    expect(tweet.toPublic().author).toBeNull();
  });
});
