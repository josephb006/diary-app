'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { getTodayString } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { href: `/diary/${getTodayString()}`, label: '오늘', icon: '✏️', color: 'bg-accent-light text-accent' },
    { href: '/diary', label: '캘린더', icon: '📅', color: 'bg-accent-light text-accent' },
    { href: '/search', label: '검색', icon: '🔍', color: 'bg-accent-light text-accent' },
    { href: '/quotes', label: '명언', icon: '💬', color: 'bg-accent-light text-accent' },
    { href: '/settings', label: '설정', icon: '⚙️', color: 'bg-accent-light text-accent' },
  ];

  const isActive = (href: string) => {
    if (href === '/diary' && pathname === '/diary') return true;
    if (href.startsWith('/diary/') && pathname.startsWith('/diary/')) return true;
    if (href === '/search' && pathname === '/search') return true;
    if (href === '/quotes' && pathname === '/quotes') return true;
    if (href === '/settings' && pathname === '/settings') return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-bg-card to-bg-card/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,37,32,0.06)]">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl font-bold text-text-primary font-[family-name:var(--font-serif-kr)] tracking-tight group-hover:text-accent transition-colors">
            나의 일기
          </span>
          <span className="text-accent/40 text-xs font-[family-name:var(--font-serif-kr)] hidden sm:inline">diary</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                isActive(item.href)
                  ? `${item.color} font-semibold shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]`
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Theme toggle with animated transition */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full text-text-secondary hover:bg-bg-hover transition-all duration-300 group overflow-hidden w-9 h-9 flex items-center justify-center"
            aria-label="테마 전환"
          >
            <span
              className={`absolute transition-all duration-500 ease-in-out ${
                theme === 'light'
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 -rotate-90 scale-50'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
            <span
              className={`absolute transition-all duration-500 ease-in-out ${
                theme === 'dark'
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-90 scale-50'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>
          </button>

          {/* Logout button - icon style */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center justify-center p-2 rounded-full text-text-muted hover:bg-bg-hover hover:text-danger transition-all duration-200"
            title="로그아웃"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
