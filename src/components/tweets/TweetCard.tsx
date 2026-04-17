'use client';

import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  isLiked?: boolean;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
}

export function TweetCard({ tweet, currentUserId, isLiked, onDelete, onLike }: TweetCardProps) {
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
          <Link href={`/tweet/${tweet.id}`} className="block">
            <p className="mt-1 whitespace-pre-wrap break-words hover:text-foreground/80">
              {tweet.content}
            </p>
          </Link>
          <div className="mt-2 flex items-center gap-4">
            <Link
              href={`/tweet/${tweet.id}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{tweet.replyCount ?? 0}</span>
            </Link>
            <button
              onClick={() => onLike?.(tweet.id)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')} />
              <span>{tweet.likeCount ?? 0}</span>
            </button>
            {isOwner && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive h-auto p-0 text-sm"
                onClick={() => onDelete(tweet.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
