'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
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
  const progress = (content.length / MAX_LENGTH) * 100;

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
        <Avatar className="h-11 w-11 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {user.displayName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full resize-none bg-transparent text-xl placeholder:text-muted-foreground focus:outline-none"
            rows={3}
            maxLength={MAX_LENGTH}
          />
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
            {content.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.15"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke={remaining < 0 ? '#ef4444' : remaining < 20 ? '#f59e0b' : 'currentColor'}
                    strokeWidth="2"
                    strokeDasharray={`${Math.min(progress, 100) * 0.628} 62.8`}
                    className={remaining >= 20 ? 'text-primary' : ''}
                  />
                </svg>
                {remaining < 20 && (
                  <span
                    className={cn(
                      'text-sm tabular-nums',
                      remaining < 0 ? 'text-destructive' : 'text-amber-500',
                    )}
                  >
                    {remaining}
                  </span>
                )}
              </div>
            )}
            <Button
              type="submit"
              disabled={!content.trim() || isPosting}
              className="rounded-full px-5 font-bold"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
