export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { CalendarView } from '@/components/calendar/CalendarView';

export default async function DiaryCalendarPage() {
  const { data: entries } = await supabase
    .from('DiaryEntry')
    .select('date, bodyStatus, soulStatus')
    .order('date', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-serif-kr)] mb-6">캘린더</h1>
      <div className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow)]">
        <CalendarView entries={entries ?? []} />
      </div>
    </div>
  );
}
