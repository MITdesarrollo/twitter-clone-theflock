import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/search', label: 'Explore', icon: '🔍' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Sidebar() {
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
              <span>{item.icon}</span>
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-2">
        <ThemeToggle />
      </div>
    </aside>
  );
}
