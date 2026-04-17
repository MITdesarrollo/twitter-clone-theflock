'use client';

import Link from 'next/link';
import { Home, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', Icon: Home },
    { href: '/search', label: 'Explore', Icon: Search },
    ...(user ? [{ href: `/profile/${user.username}`, label: 'Profile', Icon: User }] : []),
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col justify-between border-r border-border p-4 md:flex">
      <div>
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-xl font-bold">Flock</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-full px-4 py-3 text-lg transition-colors hover:bg-accent"
            >
              <Icon className="h-6 w-6" strokeWidth={1.75} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-3">
        {user ? (
          <div className="flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {user.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{user.displayName}</p>
              <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full rounded-full font-bold">
              Sign in
            </Button>
          </Link>
        )}
        <div className="px-2">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
