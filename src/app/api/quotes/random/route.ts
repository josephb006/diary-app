import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.quote.count();

    if (count === 0) {
      return NextResponse.json(null);
    }

    const randomIndex = Math.floor(Math.random() * count);

    const quote = await prisma.quote.findFirst({
      skip: randomIndex,
      take: 1,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Failed to fetch random quote:', error);
    return NextResponse.json(
      { error: '랜덤 명언을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
