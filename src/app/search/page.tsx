'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatDateKorean, getStatusEmoji } from '@/lib/utils';

interface SearchEntry {
  id: string;
  date: string;
  happenings: string | null;
  bodyStatus: number | null;
  soulStatus: number | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (from) params.set('from', from);
    if (to) params.set('to', to);

    const res = await fetch(`/api/diary?${params}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data.entries);
      setSearched(true);
    }
  }, [query, from, to]);

  useEffect(() => {
    if (!query && !from && !to) { setResults([]); setSearched(false); return; }
    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
  }, [query, from, to, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-serif-kr)] mb-6">검색</h1>

      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)] mb-6 space-y-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="키워드로 검색..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
          autoFocus
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-text-muted mb-1">시작일</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-text-muted mb-1">종료일</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {results.map(entry => (
          <Link
            key={entry.id}
            href={`/diary/${entry.date}`}
            className="block bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)] hover:bg-bg-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text-primary">{formatDateKorean(entry.date)}</span>
              <div className="flex gap-1 text-sm">
                {entry.bodyStatus && <span>{getStatusEmoji(entry.bodyStatus)}</span>}
                {entry.soulStatus && <span>{getStatusEmoji(entry.soulStatus)}</span>}
              </div>
            </div>
            {entry.happenings && (
              <p className="text-sm text-text-secondary line-clamp-2">{entry.happenings}</p>
            )}
          </Link>
        ))}
        {searched && results.length === 0 && (
          <p className="text-center text-text-muted py-8">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
