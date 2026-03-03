export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { DiaryForm } from '@/components/diary/DiaryForm';
import { DiaryFormData } from '@/lib/types';

export default async function DiaryDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  const { data: entry } = await supabase
    .from('DiaryEntry')
    .select('*, exercises:Exercise(*), meals:Meal(*), quote:Quote(*)')
    .eq('date', date)
    .single();

  const { count } = await supabase.from('Quote').select('*', { count: 'exact', head: true });
  let randomQuote = null;
  if (count && count > 0) {
    const { data } = await supabase.from('Quote').select('*').limit(1).range(
      Math.floor(Math.random() * count), Math.floor(Math.random() * count)
    );
    randomQuote = data?.[0] ?? null;
  }

  let initialData: DiaryFormData | undefined;
  if (entry) {
    let customFields: { label: string; value: string }[] = [];
    if (entry.customFields) {
      try { customFields = JSON.parse(entry.customFields); } catch { /* ignore */ }
    }
    initialData = {
      happenings: entry.happenings ?? '',
      gratitude: entry.gratitude ?? '',
      sleepBedTime: entry.sleepBedTime ?? '',
      sleepWakeTime: entry.sleepWakeTime ?? '',
      bodyStatus: entry.bodyStatus ?? 3,
      bodyNote: entry.bodyNote ?? '',
      soulStatus: entry.soulStatus ?? 3,
      soulNote: entry.soulNote ?? '',
      games: entry.games ?? '',
      shopping: entry.shopping ?? '',
      exercises: (entry.exercises ?? []).map((e: { id: string; type: string; duration: number | null; note: string | null }) => ({
        id: e.id, type: e.type, duration: e.duration, note: e.note,
      })),
      meals: (entry.meals ?? []).map((m: { id: string; mealType: string; content: string }) => ({
        id: m.id, mealType: m.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack', content: m.content,
      })),
      customFields,
    };
  }

  return (
    <DiaryForm
      date={date}
      initialData={initialData}
      quoteText={randomQuote?.text}
      quoteAuthor={randomQuote?.author}
    />
  );
}
