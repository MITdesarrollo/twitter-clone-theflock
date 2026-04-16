'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { PublicTweet } from '@/core/domain/entities/Tweet';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

interface TweetCardProps {
  tweet: PublicTweet;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

export function TweetCard({ tweet, currentUserId, onDelete }: TweetCardProps) {
  const isOwner = currentUserId && tweet.authorId === currentUserId;
  const initials = tweet.author?.displayName?.[0]?.toUpperCase() ?? '?';

  return (
    <article className="border-b border-border p-4">
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.author?.username ?? ''}`}>
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${tweet.author?.username ?? ''}`}
              className="font-semibold truncate hover:underline"
            >
              {tweet.author?.displayName ?? 'Unknown'}
            </Link>
            <span className="text-muted-foreground text-sm truncate">
              @{tweet.author?.username ?? 'unknown'}
            </span>
            <span className="text-muted-foreground text-sm">· {timeAgo(tweet.createdAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words">{tweet.content}</p>
          {isOwner && onDelete && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(tweet.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
