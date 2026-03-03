import { prisma } from '@/lib/prisma';
import { CalendarView } from '@/components/calendar/CalendarView';

export default async function DiaryCalendarPage() {
  const entries = await prisma.diaryEntry.findMany({
    select: { date: true, bodyStatus: true, soulStatus: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-serif-kr)] mb-6">캘린더</h1>
      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
        <CalendarView entries={entries} />
      </div>
    </div>
  );
}
