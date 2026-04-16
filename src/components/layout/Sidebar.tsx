'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Explore' },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 border-r border-border p-4 h-screen sticky top-0">
      <div>
        <h1 className="text-xl font-bold mb-8 px-2">Twitter Clone</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
          {user && (
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="text-lg">Profile</span>
            </Link>
          )}
        </nav>
      </div>
      <div className="space-y-3 px-2">
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Sign in
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
}
