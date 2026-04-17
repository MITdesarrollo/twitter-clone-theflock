'use client';

import Link from 'next/link';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  const [isAnimating, setIsAnimating] = useState(false);

  function handleLikeClick() {
    if (!isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 350);
    }
    onLike?.(tweet.id);
  }

  return (
    <article className="border-b border-border p-4 transition-colors hover:bg-accent/30">
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.author?.username ?? ''}`} className="flex-shrink-0">
          <Avatar className="h-11 w-11 ring-2 ring-transparent transition-all hover:ring-primary/20">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[15px]">
            <Link
              href={`/profile/${tweet.author?.username ?? ''}`}
              className="truncate font-bold hover:underline"
            >
              {tweet.author?.displayName ?? 'Unknown'}
            </Link>
            <span className="truncate text-sm text-muted-foreground">
              @{tweet.author?.username ?? 'unknown'}
            </span>
            <span className="text-sm text-muted-foreground">· {timeAgo(tweet.createdAt)}</span>
          </div>
          <Link href={`/tweet/${tweet.id}`} className="block">
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-snug">
              {tweet.content}
            </p>
          </Link>
          <div className="mt-3 flex items-center gap-6 text-muted-foreground">
            <Link
              href={`/tweet/${tweet.id}`}
              className="group flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-primary/10">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="tabular-nums">{tweet.replyCount ?? 0}</span>
            </Link>
            <button
              onClick={handleLikeClick}
              className={cn(
                'group flex items-center gap-1.5 text-sm transition-colors',
                isLiked ? 'text-red-500' : 'hover:text-red-500',
              )}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-red-500/10">
                <Heart
                  className={cn(
                    'h-4 w-4 transition-all',
                    isLiked && 'fill-red-500 text-red-500',
                    isAnimating && 'animate-heart-pop',
                  )}
                />
              </span>
              <span className="tabular-nums">{tweet.likeCount ?? 0}</span>
            </button>
            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(tweet.id)}
                className="group ml-auto flex items-center gap-1.5 text-sm transition-colors hover:text-destructive"
                aria-label="Delete tweet"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
