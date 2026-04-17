'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TweetCard } from './TweetCard';
import { ReplyComposer } from './ReplyComposer';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

interface TweetThreadProps {
  tweet: PublicTweet;
  initialReplies: PublicTweet[];
  initialNextCursor: string | null;
}

export function TweetThread({ tweet, initialReplies, initialNextCursor }: TweetThreadProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<PublicTweet[]>(initialReplies);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  function handleReplyCreated(reply: PublicTweet) {
    setReplies((prev) => [...prev, reply]);
  }

  async function loadMore() {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/tweets/${tweet.id}?cursor=${nextCursor}`);
      if (res.ok) {
        const data = await res.json();
        setReplies((prev) => [...prev, ...data.replies]);
        setNextCursor(data.nextCursor);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div>
      <TweetCard tweet={tweet} currentUserId={user?.id} />
      <ReplyComposer parentId={tweet.id} onReplyCreated={handleReplyCreated} />
      {replies.length > 0 && (
        <div className="pl-8 md:pl-12 border-l-2 border-border ml-6">
          {replies.map((reply) => (
            <TweetCard key={reply.id} tweet={reply} currentUserId={user?.id} />
          ))}
        </div>
      )}
      {nextCursor && (
        <div className="p-4 text-center">
          <button
            onClick={loadMore}
            className="text-sm text-primary hover:underline"
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load more replies'}
          </button>
        </div>
      )}
    </div>
  );
}
