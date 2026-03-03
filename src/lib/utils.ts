import { format, parse, differenceInMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDateKorean(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko });
}

export function formatMonthKorean(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return format(date, 'yyyy년 M월', { locale: ko });
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function calculateSleepDuration(bedTime: string, wakeTime: string): string {
  if (!bedTime || !wakeTime) return '';

  const today = new Date();
  const bed = parse(bedTime, 'HH:mm', today);
  let wake = parse(wakeTime, 'HH:mm', today);

  // If wake time is earlier than bed time, assume next day
  if (wake <= bed) {
    wake = new Date(wake.getTime() + 24 * 60 * 60 * 1000);
  }

  const totalMinutes = differenceInMinutes(wake, bed);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function getStatusEmoji(status: number): string {
  const emojis = ['😫', '😟', '😐', '😊', '🤩'];
  return emojis[status - 1] || '😐';
}

export function generateSearchContent(data: {
  happenings?: string | null;
  gratitude?: string | null;
  games?: string | null;
  shopping?: string | null;
  bodyNote?: string | null;
  soulNote?: string | null;
  exercises?: { type: string; note?: string | null }[];
  meals?: { content: string }[];
  customFields?: { label: string; value: string }[];
}): string {
  const parts = [
    data.happenings,
    data.gratitude,
    data.games,
    data.shopping,
    data.bodyNote,
    data.soulNote,
    ...(data.exercises?.map(e => `${e.type} ${e.note || ''}`) || []),
    ...(data.meals?.map(m => m.content) || []),
    ...(data.customFields?.map(f => `${f.label} ${f.value}`) || []),
  ];

  return parts.filter(Boolean).join(' ');
}
