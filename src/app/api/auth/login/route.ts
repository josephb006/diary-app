import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const { data: settings } = await supabase.from('AppSettings').select('passwordHash').eq('id', 1).maybeSingle();
    if (!settings) {
      return NextResponse.json({ error: '비밀번호가 설정되지 않았습니다.' }, { status: 400 });
    }

    const valid = await verifyPassword(password, settings.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 });
    }

    const token = await createSession();
    const response = NextResponse.json({ success: true });
    await setSessionCookie(token);
    return response;
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
