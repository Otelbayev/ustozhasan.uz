/**
 * Kirish nazorati (Next.js 16 da `proxy.ts`, ilgari `middleware.ts` deb atalgan).
 *
 * Har bir so'rov sahifaga yetib borishidan OLDIN shu yerdan o'tadi. Sessiyasi
 * bo'lmagan foydalanuvchi /login ga yo'naltiriladi — ya'ni himoya har bir
 * sahifada alohida yozilmaydi va biror sahifani "himoyalashni unutish"
 * imkoniyati yo'q.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

// /api/login — kirish shu yerda amalga oshadi, sessiyasiz ochiq bo'lishi shart
const PUBLIC_PATHS = ['/login', '/api/login'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Sozlama yo'q bo'lsa hech kimni kiritmaymiz ("xato = ochiq" bo'lmasin)
    return new NextResponse('SESSION_SECRET sozlanmagan', { status: 500 });
  }

  const isAuthed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, secret);
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublic) {
    // Allaqachon kirgan bo'lsa, login SAHIFASI kerak emas.
    // /api/login bunga kirmaydi: parolni qayta yuborish har doim ishlasin.
    if (isAuthed && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    const loginUrl = new URL('/login', request.url);
    // Kirgandan keyin xohlagan sahifasiga qaytaramiz
    if (pathname !== '/') loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Statik fayllar va rasm optimizatsiyasidan tashqari HAMMASI tekshiriladi
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
