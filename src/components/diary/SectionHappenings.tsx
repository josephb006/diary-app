'use client';

interface SectionHappeningsProps {
  value: string;
  onChange: (v: string) => void;
}

export function SectionHappenings({ value, onChange }: SectionHappeningsProps) {
  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-happenings relative overflow-hidden"
    >
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-section-happenings-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl" role="img" aria-label="happenings">📝</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            오늘의 일과
          </h3>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="오늘 하루는 어땠나요? 기억에 남는 순간들을 적어보세요..."
          rows={5}
          className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-y min-h-[140px] leading-relaxed"
        />
      </div>
    </section>
  );
}
