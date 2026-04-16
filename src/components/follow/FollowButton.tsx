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
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
