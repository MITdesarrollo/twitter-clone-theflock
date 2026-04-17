'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

const MAX_LENGTH = 280;

export function ReplyComposer({
  parentId,
  onReplyCreated,
}: {
  parentId: string;
  onReplyCreated: (tweet: PublicTweet) => void;
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
        body: JSON.stringify({ content, parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post reply');
      onReplyCreated(data.tweet);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-border p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post your reply..."
        className="w-full resize-none bg-transparent placeholder:text-muted-foreground focus:outline-none"
        rows={2}
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
          {isPosting ? 'Replying...' : 'Reply'}
        </Button>
      </div>
    </form>
  );
}
