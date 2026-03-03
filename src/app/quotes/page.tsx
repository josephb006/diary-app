
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Quote {
  id: string;
  text: string;
  author: string | null;
  source: string | null;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');

  const fetchQuotes = useCallback(async () => {
    const res = await fetch('/api/quotes');
    if (res.ok) setQuotes(await res.json());
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const resetForm = () => {
    setText('');
    setAuthor('');
    setSource('');
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editing) {
      await fetch(`/api/quotes/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: author || null, source: source || null }),
      });
    } else {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: author || null, source: source || null }),
      });
    }
    resetForm();
    fetchQuotes();
  };

  const handleEdit = (q: Quote) => {
    setEditing(q);
    setText(q.text);
    setAuthor(q.author ?? '');
    setSource(q.source ?? '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 명언을 삭제하시겠습니까?')) return;
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    fetchQuotes();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-serif-kr)]">명언 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover"
        >
          명언 추가
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-card rounded-2xl p-4 mb-6 shadow-[var(--shadow)] space-y-3">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="명언을 입력하세요..."
            className="w-full px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted resize-none"
            rows={2}
            autoFocus
          />
          <div className="flex gap-3">
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="작가/출처 인물"
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
            />
            <input
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="출처 (책, 영화 등)"
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-input text-text-primary placeholder-text-muted"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={resetForm} className="px-4 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-bg-hover">
              취소
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover">
              {editing ? '수정' : '추가'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {quotes.map(q => (
          <div key={q.id} className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
            <p className="text-text-primary font-[family-name:var(--font-serif-kr)] italic">
              &ldquo;{q.text}&rdquo;
            </p>
            {(q.author || q.source) && (
              <p className="text-sm text-text-muted mt-1">
                {q.author && `- ${q.author}`}{q.source && ` (${q.source})`}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(q)} className="text-xs text-accent hover:underline">수정</button>
              <button onClick={() => handleDelete(q.id)} className="text-xs text-danger hover:underline">삭제</button>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <p className="text-center text-text-muted py-8">등록된 명언이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
