import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  variable: '--font-sans-kr',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const notoSerifKR = Noto_Serif_KR({
  variable: '--font-serif-kr',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: '나의 일기',
  description: '매일의 소중한 기록을 담는 개인 다이어리',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} font-[family-name:var(--font-sans-kr)] antialiased bg-bg-primary text-text-primary`}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
