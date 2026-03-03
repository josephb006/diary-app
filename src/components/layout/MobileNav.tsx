'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getTodayString } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: `/diary/${getTodayString()}`, label: '오늘', icon: '✏️', match: '/diary/' },
    { href: '/diary', label: '캘린더', icon: '📅', match: '/diary' },
    { href: '/search', label: '검색', icon: '🔍', match: '/search' },
    { href: '/quotes', label: '명언', icon: '💬', match: '/quotes' },
    { href: '/settings', label: '설정', icon: '⚙️', match: '/settings' },
  ];

  const isActive = (item: typeof navItems[number]) => {
    if (item.match === '/diary/' && pathname.startsWith('/diary/')) return true;
    if (item.match === '/diary' && pathname === '/diary') return true;
    return pathname === item.match;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card/80 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(44,37,32,0.08)]">
      <div className="flex items-center justify-around h-18 px-2 pt-1 pb-safe">
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
                active
                  ? 'text-accent'
                  : 'text-text-muted active:scale-95'
              }`}
            >
              {/* Active pill background */}
              {active && (
                <span className="absolute inset-0 bg-accent-light rounded-2xl" />
              )}
              <span className={`relative text-xl transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`relative text-[10px] font-medium ${active ? 'text-accent' : ''}`}>
                {item.label}
              </span>
              {/* Active indicator dot */}
              {active && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
