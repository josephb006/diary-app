import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { data: existing } = await supabase.from('AppSettings').select('id').eq('id', 1).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: '비밀번호가 이미 설정되어 있습니다.' }, { status: 400 });
    }

    const { password } = await req.json();
    if (!password || password.length < 4) {
      return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const { error } = await supabase.from('AppSettings').insert({
      id: 1, passwordHash, createdAt: now, updatedAt: now,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const token = await createSession();
    const response = NextResponse.json({ success: true });
    await setSessionCookie(token);
    return response;
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
