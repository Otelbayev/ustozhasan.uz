/**
 * Sessiya: imzolangan cookie.
 *
 * Ishlash tartibi:
 *   1. To'g'ri parol kiritilganda `payload.signature` ko'rinishidagi token
 *      yaratiladi va httpOnly cookie'ga yoziladi.
 *   2. Har bir so'rovda imzo qayta hisoblanib solishtiriladi.
 *
 * Nega imzo kerak: cookie foydalanuvchi qo'lida turadi va uni istagancha
 * o'zgartirishi mumkin. SESSION_SECRET ni bilmasdan to'g'ri imzo yasab
 * bo'lmaydi — ya'ni soxta sessiya bilan kira olmaydi.
 *
 * Nega Web Crypto (node:crypto emas): bu kod Next.js proxy (edge runtime)
 * ichida ham ishlaydi, u yerda node modullari mavjud emas.
 */

const encoder = new TextEncoder();

export const SESSION_COOKIE = 'uh_admin_session';
const MAX_AGE_SEC = 60 * 60 * 8; // 8 soat

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/**
 * Ikkita satrni vaqt bo'yicha xavfsiz solishtiradi.
 *
 * Oddiy `===` mos kelgan belgilar soniga qarab turlicha vaqt sarflaydi;
 * shu farqni o'lchab imzoni belgima-belgi topish mumkin (timing attack).
 * Bu yerda esa har doim butun satr bo'ylab yuriladi.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
        // Tasodifiy qism: bir xil vaqtda yaratilgan tokenlar ham har xil bo'lsin
        jti: toBase64Url(crypto.getRandomValues(new Uint8Array(12))),
      }),
    ),
  );

  return `${payload}.${await hmac(payload, secret)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = await hmac(payload, secret);
  if (!safeEqual(signature, expected)) return false;

  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' && json.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/**
 * @param isSecureRequest so'rov HTTPS orqali kelganmi
 *
 * `secure` bayrog'i NODE_ENV ga emas, aynan SO'ROV PROTOKOLIGA bog'langan.
 * Nega: `next start` NODE_ENV ni doim "production" qiladi. Agar bayroq
 * shunga bog'lansa, localda http://localhost orqali kirganda brauzer
 * cookie'ni umuman saqlamaydi va "parol to'g'ri, lekin kira olmayapman"
 * degan tushunarsiz holat chiqadi. Protokolga bog'lash esa har doim to'g'ri:
 * HTTPS bo'lsa — himoyalangan, bo'lmasa — cookie baribir shifrlanmagan
 * kanalda ketardi.
 */
export const sessionCookieOptions = (isSecureRequest: boolean) => ({
  httpOnly: true, // JavaScript o'qiy olmaydi -> XSS orqali o'g'irlab bo'lmaydi
  sameSite: 'lax' as const, // boshqa saytdan yuborilgan so'rovga qo'shilmaydi -> CSRF himoyasi
  secure: isSecureRequest,
  path: '/',
  maxAge: MAX_AGE_SEC,
});
