'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (!data.isSetup) {
          router.replace('/setup');
        } else if (data.isAuthenticated) {
          router.replace('/');
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.replace('/');
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-text-muted animate-pulse">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 relative overflow-hidden">
      {/* Decorative warm gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-accent/[0.06] to-transparent pointer-events-none" />

      {/* Decorative background book emoji */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="text-[12rem] opacity-[0.03] block transform -rotate-12">
          📖
        </span>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo area */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-text-primary font-[family-name:var(--font-serif-kr)] tracking-tight">
            나의 일기
          </h1>
          {/* Decorative underline */}
          <div className="flex items-center justify-center mt-3 gap-2">
            <span className="h-px w-8 bg-accent/30" />
            <span className="text-accent/50 text-xs font-[family-name:var(--font-serif-kr)]">My Diary</span>
            <span className="h-px w-8 bg-accent/30" />
          </div>
          <p className="mt-4 text-text-secondary text-sm">오늘도 좋은 하루 보내셨나요?</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-card rounded-2xl p-7 shadow-[0_8px_30px_rgba(44,37,32,0.1)] border border-border/50"
        >
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-danger text-sm mb-4 bg-danger-light px-3 py-2 rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium shadow-[0_2px_8px_rgba(196,149,106,0.3)] hover:shadow-[0_4px_16px_rgba(196,149,106,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            열기
          </button>
        </form>

        {/* Decorative quote */}
        <p className="text-center mt-8 text-text-muted/60 text-xs font-[family-name:var(--font-serif-kr)] italic">
          &ldquo;기록하지 않으면 기억하지 못한다&rdquo;
        </p>
      </div>
    </div>
  );
}
