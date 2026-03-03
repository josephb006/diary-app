import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, author, source, isFavorite } = body;

    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '명언을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(author !== undefined && { author: author || null }),
        ...(source !== undefined && { source: source || null }),
        ...(isFavorite !== undefined && { isFavorite }),
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Failed to update quote:', error);
    return NextResponse.json(
      { error: '명언을 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '명언을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return NextResponse.json(
      { error: '명언을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
