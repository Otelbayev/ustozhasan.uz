/**
 * Funnel hodisalarini to'plab, bitta INSERT bilan yozadi.
 *
 * Nega: eski kodda har `/start` uchun 3 ta alohida DB so'rovi ketardi va
 * handler ularni KUTARDI — ya'ni baza sekinlashsa foydalanuvchi javobni
 * ham kutardi. Endi hodisa xotiradagi buferga tushadi (kutish yo'q),
 * 100 ta to'planganda yoki 200ms o'tganda bitta multi-row INSERT ketadi.
 *
 * Ma'lumot yo'qolishi: bufer to'lib ketsa (baza uzoq vaqt ishlamasa) eng
 * eski hodisalar tashlab yuboriladi — bu ataylab qilingan. Analitika
 * hodisasi uchun botning yiqilishidan ko'ra bir necha yozuvni yo'qotgan
 * afzal. Foydalanuvchi ma'lumotlari (users jadvali) bundan ta'sirlanmaydi.
 */

const pool = require('./pool');
const logger = require('../utils/logger');

const FLUSH_INTERVAL_MS = 200;
const FLUSH_SIZE = 100;
const MAX_BUFFER = 5_000;

let buffer = [];
let timer = null;
/** Hozir ketayotgan yozish (bo'lmasa null). Ikki marta parallel yozmaslik uchun. */
let flushPromise = null;
let dropped = 0;

function scheduleFlush() {
  if (timer || flushPromise) return;
  timer = setTimeout(() => {
    timer = null;
    flush().catch(() => {});
  }, FLUSH_INTERVAL_MS);
  // Bufer bo'sh bo'lsa timer process'ni tirik ushlab turmasin
  if (typeof timer.unref === 'function') timer.unref();
}

/**
 * Hodisani navbatga qo'yadi. `await` qilish SHART EMAS — atayin sinxron.
 */
function logEvent(userId, eventType, meta = null) {
  if (!userId) return;

  if (buffer.length >= MAX_BUFFER) {
    buffer.shift();
    dropped += 1;
    if (dropped % 500 === 1) {
      logger.warn('Hodisa buferi to\'lib ketdi — eski yozuvlar tashlanmoqda', { dropped });
    }
  }

  buffer.push([userId, eventType, meta ? JSON.stringify(meta) : null, new Date()]);

  if (buffer.length >= FLUSH_SIZE) {
    flush().catch(() => {});
  } else {
    scheduleFlush();
  }
}

async function writeBatch(batch) {
  const values = [];
  const params = [];
  batch.forEach((row, i) => {
    const base = i * 4;
    values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
    params.push(row[0], row[1], row[2], row[3]);
  });

  await pool.query(
    `INSERT INTO funnel_events (user_id, event_type, meta, created_at)
     VALUES ${values.join(', ')}`,
    params
  );
}

/** Bufer to'liq bo'shaguncha yozadi. */
async function drain() {
  while (buffer.length) {
    const batch = buffer.splice(0, FLUSH_SIZE);
    try {
      await writeBatch(batch);
    } catch (err) {
      // Bazaga yozilmadi — shu partiyani tashlaymiz, lekin xatoni ko'rsatamiz.
      // Qayta urinmaymiz: baza tushgan bo'lsa navbat cheksiz o'sib ketardi.
      logger.error('Funnel hodisalarini yozib bo\'lmadi', { count: batch.length, err: err.message });
    }
  }
}

/**
 * Buferni bazaga yozadi. Shutdown'da ham chaqiriladi.
 *
 * ⚠️ Muhim: yozish allaqachon ketayotgan bo'lsa, DARHOL qaytmaydi — o'sha
 * jarayonni kutadi. Aks holda `await flush()` chaqirgan tomon "hammasi
 * yozildi" deb o'ylab, process'ni yopib yuborardi va navbatdagi hodisalar
 * yo'qolardi (1000 tadan ~140 tasi shunday yo'qolgan edi).
 */
function flush() {
  if (flushPromise) return flushPromise;

  flushPromise = drain().finally(() => {
    flushPromise = null;
  });
  return flushPromise;
}

module.exports = { logEvent, flush };
