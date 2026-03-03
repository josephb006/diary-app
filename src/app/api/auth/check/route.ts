import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionToken, verifySession } from '@/lib/session';

export async function GET() {
  try {
    const { data: settings } = await supabase.from('AppSettings').select('id').eq('id', 1).maybeSingle();
    const isSetup = !!settings;
    const token = await getSessionToken();
    const isAuthenticated = token ? await verifySession(token) : false;
    return NextResponse.json({ isSetup, isAuthenticated });
  } catch {
    return NextResponse.json({ isSetup: false, isAuthenticated: false });
  }
}
