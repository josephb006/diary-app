import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const existing = await prisma.appSettings.findFirst();
    if (existing) {
      return NextResponse.json({ error: '비밀번호가 이미 설정되어 있습니다.' }, { status: 400 });
    }

    const { password } = await request.json();

    if (!password || password.length < 4) {
      return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await prisma.appSettings.create({
      data: { passwordHash },
    });

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '설정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
