import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/content';

/** Public API to fetch site settings (useful for client-side when needed) */
export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
