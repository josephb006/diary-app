import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSearchContent } from '@/lib/utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    const entry = await prisma.diaryEntry.findUnique({
      where: { date },
      include: {
        exercises: true,
        meals: true,
        quote: true,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: '해당 날짜의 일기를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to fetch diary entry:', error);
    return NextResponse.json(
      { error: '일기를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const body = await request.json();
    const {
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

    const entryData = {
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
    };

    // Check if entry exists
    const existing = await prisma.diaryEntry.findUnique({
      where: { date },
    });

    let entry;

    if (existing) {
      // Delete existing exercises and meals, then recreate
      await prisma.exercise.deleteMany({ where: { diaryId: existing.id } });
      await prisma.meal.deleteMany({ where: { diaryId: existing.id } });

      entry = await prisma.diaryEntry.update({
        where: { date },
        data: {
          ...entryData,
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
    } else {
      // Create new entry
      entry = await prisma.diaryEntry.create({
        data: {
          date,
          ...entryData,
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
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to update diary entry:', error);
    return NextResponse.json(
      { error: '일기를 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    const existing = await prisma.diaryEntry.findUnique({
      where: { date },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '해당 날짜의 일기를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.diaryEntry.delete({
      where: { date },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete diary entry:', error);
    return NextResponse.json(
      { error: '일기를 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
