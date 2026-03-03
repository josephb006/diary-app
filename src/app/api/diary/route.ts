import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSearchContent } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    // Build where clause
    const where: Record<string, unknown> = {};

    // Search filter
    if (q) {
      where.searchContent = {
        contains: q,
      };
    }

    // Date range filter
    if (from || to) {
      const dateFilter: Record<string, string> = {};
      if (from) dateFilter.gte = from;
      if (to) dateFilter.lte = to;
      where.date = dateFilter;
    }

    // Get total count
    const totalCount = await prisma.diaryEntry.count({ where });

    // Get paginated entries
    const entries = await prisma.diaryEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        exercises: true,
        meals: true,
        quote: true,
      },
    });

    const hasMore = page * pageSize < totalCount;

    return NextResponse.json({
      entries,
      totalCount,
      page,
      pageSize,
      hasMore,
    });
  } catch (error) {
    console.error('Failed to fetch diary entries:', error);
    return NextResponse.json(
      { error: '일기 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      happenings,
      gratitude,
      sleepBedTime,
      sleepWakeTime,
      bodyStatus,
      bodyNote,
      soulStatus,
      soulNote,
      games,
      shopping,
      exercises,
      meals,
      customFields,
      quoteId,
    } = body;

    // Check if entry for this date already exists
    const existing = await prisma.diaryEntry.findUnique({
      where: { date },
    });

    if (existing) {
      return NextResponse.json(
        { error: '해당 날짜의 일기가 이미 존재합니다.' },
        { status: 409 }
      );
    }

    // Generate search content
    const searchContent = generateSearchContent({
      happenings,
      gratitude,
      games,
      shopping,
      bodyNote,
      soulNote,
      exercises,
      meals,
      customFields,
    });

    // Create entry with nested relations
    const entry = await prisma.diaryEntry.create({
      data: {
        date,
        happenings: happenings || null,
        gratitude: gratitude || null,
        sleepBedTime: sleepBedTime || null,
        sleepWakeTime: sleepWakeTime || null,
        bodyStatus: bodyStatus ?? null,
        bodyNote: bodyNote || null,
        soulStatus: soulStatus ?? null,
        soulNote: soulNote || null,
        games: games || null,
        shopping: shopping || null,
        customFields: customFields ? JSON.stringify(customFields) : null,
        searchContent,
        quoteId: quoteId || null,
        exercises: {
          createMany: {
            data: (exercises || []).map((e: { type: string; duration?: number | null; note?: string | null }) => ({
              type: e.type,
              duration: e.duration ?? null,
              note: e.note || null,
            })),
          },
        },
        meals: {
          createMany: {
            data: (meals || []).map((m: { mealType: string; content: string }) => ({
              mealType: m.mealType,
              content: m.content,
            })),
          },
        },
      },
      include: {
        exercises: true,
        meals: true,
        quote: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Failed to create diary entry:', error);
    return NextResponse.json(
      { error: '일기를 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
