import { prisma } from '@/lib/prisma';
import { DiaryForm } from '@/components/diary/DiaryForm';
import { DiaryFormData } from '@/lib/types';

export default async function DiaryDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  const entry = await prisma.diaryEntry.findUnique({
    where: { date },
    include: { exercises: true, meals: true, quote: true },
  });

  // Get random quote for stamp
  const quoteCount = await prisma.quote.count();
  const randomQuote = quoteCount > 0
    ? await prisma.quote.findFirst({ skip: Math.floor(Math.random() * quoteCount) })
    : null;

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
      exercises: entry.exercises.map(e => ({
        id: e.id,
        type: e.type,
        duration: e.duration,
        note: e.note,
      })),
      meals: entry.meals.map(m => ({
        id: m.id,
        mealType: m.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        content: m.content,
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
