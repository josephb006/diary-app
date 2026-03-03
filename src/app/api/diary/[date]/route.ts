import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const { data, error } = await supabase
    .from('DiaryEntry')
    .select('*, exercises:Exercise(*), meals:Meal(*), quote:Quote(*)')
    .eq('date', date)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? null);
}

export async function PUT(req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const body = await req.json();
  const { exercises, meals, customFields, ...fields } = body;

  const now = new Date().toISOString();

  // check existing
  const { data: existing } = await supabase
    .from('DiaryEntry')
    .select('id')
    .eq('date', date)
    .maybeSingle();

  let entryId: string;

  if (existing) {
    entryId = existing.id;
    const { error } = await supabase.from('DiaryEntry').update({
      happenings: fields.happenings || null,
      gratitude: fields.gratitude || null,
      sleepBedTime: fields.sleepBedTime || null,
      sleepWakeTime: fields.sleepWakeTime || null,
      bodyStatus: fields.bodyStatus ?? null,
      bodyNote: fields.bodyNote || null,
      soulStatus: fields.soulStatus ?? null,
      soulNote: fields.soulNote || null,
      games: fields.games || null,
      shopping: fields.shopping || null,
      customFields: customFields ? JSON.stringify(customFields) : null,
      searchContent: [fields.happenings, fields.gratitude, fields.games, fields.shopping].filter(Boolean).join(' '),
      updatedAt: now,
    }).eq('id', entryId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    entryId = crypto.randomUUID();
    const { error } = await supabase.from('DiaryEntry').insert({
      id: entryId,
      date,
      happenings: fields.happenings || null,
      gratitude: fields.gratitude || null,
      sleepBedTime: fields.sleepBedTime || null,
      sleepWakeTime: fields.sleepWakeTime || null,
      bodyStatus: fields.bodyStatus ?? null,
      bodyNote: fields.bodyNote || null,
      soulStatus: fields.soulStatus ?? null,
      soulNote: fields.soulNote || null,
      games: fields.games || null,
      shopping: fields.shopping || null,
      customFields: customFields ? JSON.stringify(customFields) : null,
      searchContent: [fields.happenings, fields.gratitude, fields.games, fields.shopping].filter(Boolean).join(' '),
      createdAt: now,
      updatedAt: now,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // exercises
  await supabase.from('Exercise').delete().eq('diaryId', entryId);
  if (exercises?.length) {
    await supabase.from('Exercise').insert(
      exercises.map((e: { type: string; duration?: number; note?: string }) => ({
        id: crypto.randomUUID(),
        diaryId: entryId,
        type: e.type,
        duration: e.duration ?? null,
        note: e.note ?? null,
        createdAt: now,
      }))
    );
  }

  // meals
  await supabase.from('Meal').delete().eq('diaryId', entryId);
  if (meals?.length) {
    await supabase.from('Meal').insert(
      meals.map((m: { mealType: string; content: string }) => ({
        id: crypto.randomUUID(),
        diaryId: entryId,
        mealType: m.mealType,
        content: m.content,
        createdAt: now,
      }))
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const { error } = await supabase.from('DiaryEntry').delete().eq('date', date);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
