'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TweetComposer } from './TweetComposer';
import { TweetCard } from './TweetCard';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

export function Timeline() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState<PublicTweet[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchTweets = useCallback(async (cursor?: string) => {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    params.set('limit', '20');
    const res = await fetch(`/api/tweets?${params}`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  }, []);

  useEffect(() => {
    fetchTweets()
      .then((data) => {
        setTweets(data.tweets);
        setNextCursor(data.nextCursor);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [fetchTweets]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchTweets(nextCursor);
      setTweets((prev) => [...prev, ...data.tweets]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, fetchTweets]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  function handleTweetCreated(tweet: PublicTweet) {
    setTweets((prev) => [tweet, ...prev]);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/tweets/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTweets((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <h2 className="text-lg font-bold">Home</h2>
      </div>
      <TweetComposer onTweetCreated={handleTweetCreated} />
      {tweets.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>No tweets yet. Follow someone or post your first tweet!</p>
        </div>
      ) : (
        <>
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          ))}
          <div ref={sentinelRef} className="h-4" />
          {isLoadingMore && (
            <div className="p-4 text-center text-muted-foreground">Loading more...</div>
          )}
          {!nextCursor && tweets.length > 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              You&apos;re all caught up!
            </div>
          )}
        </>
      )}
    </div>
  );
}
