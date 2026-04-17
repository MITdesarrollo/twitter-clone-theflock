'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  username: string;
  initialIsFollowing: boolean;
  isOwnProfile: boolean;
}

export function FollowButton({ username, initialIsFollowing, isOwnProfile }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isOwnProfile) return null;

  function handleToggle() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' });
        if (!res.ok) return;
        const data = await res.json();
        setIsFollowing(data.following);
      } catch {
        // silent fail
      }
    });
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      className="rounded-full px-5 font-bold min-w-[100px]"
    >
      {isFollowing ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
    </Button>
  );
}
