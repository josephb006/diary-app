import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const settings = await prisma.appSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: '비밀번호가 설정되지 않았습니다.' },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, settings.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: '현재 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    await prisma.appSettings.update({
      where: { id: settings.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update password:', error);
    return NextResponse.json(
      { error: '비밀번호를 변경하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
