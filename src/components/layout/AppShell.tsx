'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

const AUTH_PAGES = ['/login', '/setup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6 min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
