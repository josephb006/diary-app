import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { count } = await supabase.from('Quote').select('*', { count: 'exact', head: true });
  if (!count) return NextResponse.json(null);
  const { data, error } = await supabase.from('Quote').select('*').limit(1).range(
    Math.floor(Math.random() * count), Math.floor(Math.random() * count)
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}
