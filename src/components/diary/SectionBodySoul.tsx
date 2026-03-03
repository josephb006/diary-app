'use client';

import { getStatusEmoji } from '@/lib/utils';
import { BODY_SOUL_LABELS } from '@/lib/types';

interface SectionBodySoulProps {
  bodyStatus: number;
  soulStatus: number;
  bodyNote: string;
  soulNote: string;
  onBodyStatusChange: (v: number) => void;
  onSoulStatusChange: (v: number) => void;
  onBodyNoteChange: (v: string) => void;
  onSoulNoteChange: (v: string) => void;
}

export function SectionBodySoul({
  bodyStatus,
  soulStatus,
  bodyNote,
  soulNote,
  onBodyStatusChange,
  onSoulStatusChange,
  onBodyNoteChange,
  onSoulNoteChange,
}: SectionBodySoulProps) {
  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 relative overflow-hidden"
      style={{
        borderLeftColor: 'var(--section-body)',
        animationDelay: '0.25s',
      }}
    >
      {/* Subtle background tint */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'var(--section-body-light)' }} />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-xl" role="img" aria-label="body and soul">💚</span>
          <span className="text-xl" role="img" aria-label="soul">💜</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            몸과 마음
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Body status */}
          <div className="bg-bg-input rounded-xl p-4 border border-border">
            <p className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--section-body)' }}>
              💚 몸 상태
            </p>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onBodyStatusChange(status)}
                  className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    bodyStatus === status
                      ? 'scale-110 shadow-[var(--shadow-md)]'
                      : 'bg-bg-card hover:bg-bg-hover hover:scale-105'
                  }`}
                  style={
                    bodyStatus === status
                      ? {
                          backgroundColor: 'var(--section-body-light)',
                          outline: '2px solid var(--section-body)',
                          outlineOffset: '1px',
                        }
                      : undefined
                  }
                  title={BODY_SOUL_LABELS[status - 1]}
                >
                  {getStatusEmoji(status)}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mb-3">
              {BODY_SOUL_LABELS[bodyStatus - 1]}
            </p>
            <input
              type="text"
              value={bodyNote}
              onChange={(e) => onBodyNoteChange(e.target.value)}
              placeholder="몸 상태에 대한 메모"
              className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Soul status */}
          <div className="bg-bg-input rounded-xl p-4 border border-border">
            <p className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--section-soul)' }}>
              💜 마음 상태
            </p>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onSoulStatusChange(status)}
                  className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    soulStatus === status
                      ? 'scale-110 shadow-[var(--shadow-md)]'
                      : 'bg-bg-card hover:bg-bg-hover hover:scale-105'
                  }`}
                  style={
                    soulStatus === status
                      ? {
                          backgroundColor: 'var(--section-soul-light)',
                          outline: '2px solid var(--section-soul)',
                          outlineOffset: '1px',
                        }
                      : undefined
                  }
                  title={BODY_SOUL_LABELS[status - 1]}
                >
                  {getStatusEmoji(status)}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mb-3">
              {BODY_SOUL_LABELS[soulStatus - 1]}
            </p>
            <input
              type="text"
              value={soulNote}
              onChange={(e) => onSoulNoteChange(e.target.value)}
              placeholder="마음 상태에 대한 메모"
              className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
