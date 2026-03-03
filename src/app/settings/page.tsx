'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword.length < 4) {
      setMessage('새 비밀번호는 4자 이상이어야 합니다.');
      setMessageType('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호가 일치하지 않습니다.');
      setMessageType('error');
      return;
    }

    const res = await fetch('/api/settings/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('비밀번호가 변경되었습니다.');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage(data.error || '변경에 실패했습니다.');
      setMessageType('error');
    }
  };

  const handleExport = async () => {
    const res = await fetch('/api/diary?pageSize=10000');
    if (!res.ok) return;
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data.entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-serif-kr)]">설정</h1>

      {/* Password change */}
      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
        <h2 className="font-medium text-text-primary mb-4">비밀번호 변경</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호"
            className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 (4자 이상)"
            className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
          />
          {message && (
            <p className={`text-sm ${messageType === 'success' ? 'text-success' : 'text-danger'}`}>{message}</p>
          )}
          <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover">
            변경하기
          </button>
        </form>
      </div>

      {/* Export */}
      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
        <h2 className="font-medium text-text-primary mb-2">데이터 내보내기</h2>
        <p className="text-sm text-text-secondary mb-3">모든 일기 데이터를 JSON 파일로 다운로드합니다.</p>
        <button onClick={handleExport} className="px-4 py-2 rounded-xl border border-border text-text-primary text-sm hover:bg-bg-hover">
          JSON 다운로드
        </button>
      </div>

      {/* Logout */}
      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
        <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90">
          로그아웃
        </button>
      </div>
    </div>
  );
}
