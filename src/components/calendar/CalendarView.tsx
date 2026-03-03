'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday } from 'date-fns';
import { formatMonthKorean } from '@/lib/utils';

interface EntryInfo {
  date: string;
  bodyStatus?: number | null;
  soulStatus?: number | null;
}

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

function getMoodBg(entry: EntryInfo): string {
  const avg = ((entry.bodyStatus ?? 3) + (entry.soulStatus ?? 3)) / 2;
  if (avg >= 4) return 'bg-success/10';
  if (avg >= 3) return 'bg-accent/8';
  if (avg >= 2) return 'bg-rating-fill/10';
  return 'bg-danger/8';
}

function getMoodDotColor(entry: EntryInfo): string {
  const avg = ((entry.bodyStatus ?? 3) + (entry.soulStatus ?? 3)) / 2;
  if (avg >= 4) return 'bg-success';
  if (avg >= 3) return 'bg-accent';
  if (avg >= 2) return 'bg-rating-fill';
  return 'bg-danger';
}

export function CalendarView({ entries }: { entries: EntryInfo[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  const entryMap = new Map(entries.map(e => [e.date, e]));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all duration-200 active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-xl font-bold font-[family-name:var(--font-serif-kr)] text-text-primary">
          {formatMonthKorean(currentDate.getFullYear(), currentDate.getMonth())}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all duration-200 active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-3">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-semibold tracking-widest uppercase py-2 ${
              i === 0 ? 'text-danger/70' : i === 6 ? 'text-accent/70' : 'text-text-muted'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd');
          const entry = entryMap.get(dateStr);
          const inMonth = isSameMonth(d, currentDate);
          const today = isToday(d);
          const dayOfWeek = d.getDay();

          return (
            <button
              key={dateStr}
              onClick={() => router.push(`/diary/${dateStr}`)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200
                ${!inMonth ? 'text-text-muted/30' : dayOfWeek === 0 ? 'text-danger/80' : dayOfWeek === 6 ? 'text-accent/80' : 'text-text-primary'}
                ${today ? 'bg-accent text-white font-bold shadow-[0_2px_8px_rgba(196,149,106,0.3)]' : ''}
                ${!today && entry && inMonth ? getMoodBg(entry) : ''}
                ${!today ? 'hover:bg-bg-hover hover:scale-105' : 'hover:shadow-[0_4px_12px_rgba(196,149,106,0.4)]'}
              `}
            >
              <span className={`${today ? 'text-white' : ''}`}>{d.getDate()}</span>
              {entry && !today && (
                <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${getMoodDotColor(entry)} ring-1 ring-white/50`} />
              )}
              {entry && today && (
                <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-white/80" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
