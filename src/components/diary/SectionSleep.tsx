'use client';

import { calculateSleepDuration } from '@/lib/utils';

interface SectionSleepProps {
  bedTime: string;
  wakeTime: string;
  onBedTimeChange: (v: string) => void;
  onWakeTimeChange: (v: string) => void;
}

function parseTime(hhmm: string): { period: '오전' | '오후'; hour: number; minute: string } {
  if (!hhmm) return { period: '오후', hour: 11, minute: '00' };
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const period: '오전' | '오후' = h < 12 ? '오전' : '오후';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { period, hour: h, minute: mStr ?? '00' };
}

function toHHMM(period: '오전' | '오후', hour: number, minute: string): string {
  let h = hour;
  if (period === '오전') {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

function TimePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const { period, hour, minute } = parseTime(value);

  return (
    <div className="flex items-center gap-2 bg-bg-input rounded-xl px-4 py-2.5 border border-border">
      <span className="text-sm text-text-secondary whitespace-nowrap font-medium">{label}</span>
      <button
        type="button"
        onClick={() =>
          onChange(toHHMM(period === '오전' ? '오후' : '오전', hour, minute))
        }
        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-bg-card border border-border text-text-primary hover:bg-bg-hover transition-colors min-w-[46px] text-center"
      >
        {value ? period : '--'}
      </button>
      <select
        value={value ? hour : ''}
        onChange={(e) => onChange(toHHMM(period, parseInt(e.target.value), minute))}
        className="bg-transparent border-none text-sm text-text-primary p-0 focus:ring-0 focus:outline-none cursor-pointer"
      >
        {!value && <option value="">--</option>}
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-text-muted font-bold">:</span>
      <select
        value={value ? minute : ''}
        onChange={(e) => onChange(toHHMM(period, hour, e.target.value))}
        className="bg-transparent border-none text-sm text-text-primary p-0 focus:ring-0 focus:outline-none cursor-pointer"
      >
        {!value && <option value="">--</option>}
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SectionSleep({
  bedTime,
  wakeTime,
  onBedTimeChange,
  onWakeTimeChange,
}: SectionSleepProps) {
  const duration = calculateSleepDuration(bedTime, wakeTime);

  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-sleep relative overflow-hidden"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="absolute inset-0 bg-section-sleep-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl" role="img" aria-label="sleep">🌙</span>
            <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
              수면
            </h3>
          </div>
          {duration && (
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--section-sleep-light)',
                color: 'var(--section-sleep)',
                border: '1px solid var(--section-sleep)',
                borderColor: 'color-mix(in srgb, var(--section-sleep) 30%, transparent)',
              }}
            >
              🌙 {duration}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <TimePicker value={bedTime} onChange={onBedTimeChange} label="취침" />
          <span className="text-text-muted text-lg">→</span>
          <TimePicker value={wakeTime} onChange={onWakeTimeChange} label="기상" />
        </div>
      </div>
    </section>
  );
}
