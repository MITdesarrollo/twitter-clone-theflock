'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

const MAX_LENGTH = 280;

export function TweetComposer({
  onTweetCreated,
}: {
  onTweetCreated: (tweet: PublicTweet) => void;
}) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const remaining = MAX_LENGTH - content.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || isPosting) return;
    setIsPosting(true);
    setError('');
    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create tweet');
      onTweetCreated(data.tweet);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tweet');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{user.displayName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full resize-none bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none"
            rows={3}
            maxLength={MAX_LENGTH}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-sm ${remaining < 20 ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {remaining}
            </span>
            <Button type="submit" size="sm" disabled={!content.trim() || isPosting}>
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
