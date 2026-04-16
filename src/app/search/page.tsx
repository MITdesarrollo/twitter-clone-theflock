'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { PublicUser } from '@/core/domain/entities/User';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.users);
      }
    } catch {
      // silent fail
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <h2 className="text-lg font-bold mb-3">Explore</h2>
        <Input
          type="search"
          placeholder="Search users..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div>
        {isSearching && <div className="p-4 text-center text-muted-foreground">Searching...</div>}
        {!isSearching && hasSearched && results.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No users found for &quot;{query.trim()}&quot;
          </div>
        )}
        {results.map((user) => (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            className="flex items-center gap-3 p-4 border-b border-border hover:bg-accent transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user.displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.bio && <p className="text-sm mt-0.5 line-clamp-1">{user.bio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
