import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ error: '비밀번호가 설정되지 않았습니다.' }, { status: 400 });
    }

    const isValid = await verifyPassword(password, settings.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
