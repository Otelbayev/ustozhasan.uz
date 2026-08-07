/**
 * POST /api/logout — sessiyani o'chiradi.
 * Faqat POST: havolani bosish yoki rasm yuklash bilan chiqarib yuborib bo'lmaydi.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const response = NextResponse.redirect(new URL('/login', request.url), 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
