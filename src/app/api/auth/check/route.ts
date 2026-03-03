import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifySession } from '@/lib/session';

export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst();
    const isSetup = !!settings;

    const token = await getSessionToken();
    const isAuthenticated = token ? await verifySession(token) : false;

    return NextResponse.json({ isSetup, isAuthenticated });
  } catch {
    return NextResponse.json({ isSetup: false, isAuthenticated: false });
  }
}
