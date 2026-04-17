'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', Icon: Home },
    { href: '/search', label: 'Explore', Icon: Search },
    { href: user ? `/profile/${user.username}` : '/login', label: 'Profile', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur-sm md:hidden">
      {navItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
            <span className={cn(isActive && 'font-semibold')}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
