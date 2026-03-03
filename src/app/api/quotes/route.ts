import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return NextResponse.json(
      { error: '명언 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, author, source } = body;

    if (!text) {
      return NextResponse.json(
        { error: '명언 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
      data: {
        text,
        author: author || null,
        source: source || null,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Failed to create quote:', error);
    return NextResponse.json(
      { error: '명언을 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
