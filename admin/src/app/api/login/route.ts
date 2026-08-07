/**
 * POST /api/login — parolni tekshirib, sessiya cookie'sini o'rnatadi.
 *
 * Nega Server Action emas, oddiy forma: bu yo'l JavaScript o'chirilgan
 * brauzerda ham ishlaydi, xatti-harakati oddiy HTTP (shuning uchun uni
 * qo'lda ham, avtotestda ham to'liq tekshirib bo'ladi) va bitta fayl —
 * kirishga aloqador butun mantiq shu yerda ko'rinib turadi.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { SESSION_COOKIE, createSessionToken, safeEqual, sessionCookieOptions } from '@/lib/session';

/**
 * Parolni topishga urinishlarni cheklaydi.
 *
 * Bunisiz uzun parol ham kam yordam beradi: skript daqiqasiga minglab
 * variantni sinab ko'ra oladi. 5 ta xato urinishdan keyin o'sha IP
 * 15 daqiqaga bloklanadi.
 */
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Faqat shu saytdagi yo'lga yo'naltiramiz — ochiq redirect bo'lmasin */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

function back(request: NextRequest, params: Record<string, string>) {
  const url = new URL('/login', request.url);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  // 303 — brauzer POST'ni GET'ga almashtiradi ("qayta yuborilsinmi?" chiqmaydi)
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  // CSRF himoyasi: forma faqat SHU saytdan yuborilgan bo'lsin.
  // (Sessiya cookie'si sameSite=lax — bu ikkinchi qatlam.)
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const form = await request.formData();
  const password = String(form.get('password') || '');
  const next = safeNext(String(form.get('next') || '/'));

  const ip = clientIp(request);
  if (tooManyAttempts(ip)) {
    return back(request, { error: 'rate', next });
  }

  // safeEqual — timing attack'ga qarshi (izoh: lib/session.ts)
  if (!password || !safeEqual(password, env.ADMIN_PASSWORD)) {
    // Xato xabari ataylab umumiy: parol "deyarli to'g'ri" ekanini bildirmaydi
    return back(request, { error: '1', next });
  }

  attempts.delete(ip);

  // Reverse proxy orqasida haqiqiy protokol x-forwarded-proto da bo'ladi
  const isSecure =
    request.nextUrl.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https';

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(
    SESSION_COOKIE,
    await createSessionToken(env.SESSION_SECRET),
    sessionCookieOptions(isSecure),
  );

  return response;
}
