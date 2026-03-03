'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/');
    } else {
      setError(data.error ?? '오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="bg-bg-card rounded-2xl p-8 shadow-[var(--shadow)] w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary mb-2 font-[family-name:var(--font-serif-kr)]">나의 일기</h1>
        <p className="text-text-muted text-sm mb-6">처음 오셨군요! 비밀번호를 설정해주세요.</p>
        <form onSubmit={handleSetup} className="space-y-4">
          <input type="password" placeholder="비밀번호 (4자 이상)" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={4}
            className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-primary outline-none focus:border-accent" />
          <input type="password" placeholder="비밀번호 확인" value={confirm}
            onChange={e => setConfirm(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-primary outline-none focus:border-accent" />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? '설정 중...' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
