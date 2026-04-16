'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/search', label: 'Explore', icon: '🔍' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background py-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
