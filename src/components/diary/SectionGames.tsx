'use client';

interface SectionGamesProps {
  value: string;
  onChange: (v: string) => void;
}

export function SectionGames({ value, onChange }: SectionGamesProps) {
  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-games relative overflow-hidden"
      style={{ animationDelay: '0.3s' }}
    >
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-section-games-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl" role="img" aria-label="leisure">🎮</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            여가
          </h3>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="오늘의 여가 활동을 적어보세요"
          rows={3}
          className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-y min-h-[80px] leading-relaxed"
        />
      </div>
    </section>
  );
}
