'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => {
      if (!d.isSetup) router.replace('/setup');
      if (d.isAuthenticated) router.replace('/');
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/');
    } else {
      setError(data.error ?? '비밀번호가 틀렸습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="bg-bg-card rounded-2xl p-8 shadow-[var(--shadow)] w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary mb-2 font-[family-name:var(--font-serif-kr)]">나의 일기</h1>
        <p className="text-text-muted text-sm mb-6">계속하려면 비밀번호를 입력하세요.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" placeholder="비밀번호" value={password}
            onChange={e => setPassword(e.target.value)} required autoFocus
            className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-primary outline-none focus:border-accent" />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
