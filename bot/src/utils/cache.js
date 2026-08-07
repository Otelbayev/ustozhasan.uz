/**
 * Kichik TTL + LRU cache (tashqi paketsiz).
 *
 * Nega o'zimizniki: eski koddagi oddiy `Map` hech qachon tozalanmasdi —
 * har bir yangi foydalanuvchi xotirada abadiy qolar edi (sekin sizish).
 * Bu yerda ikkita cheklov bor: vaqt (TTL) va hajm (maxSize). Ikkalasi ham
 * bo'lgani muhim — TTL faqat o'qilganda tekshirilsa, o'qilmagan yozuvlar
 * to'planib qolardi.
 */

class TtlCache {
  /**
   * @param {object} options
   * @param {number} options.ttlMs   yozuvning yashash muddati
   * @param {number} options.maxSize maksimal yozuvlar soni
   */
  constructor({ ttlMs, maxSize = 10_000 }) {
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
    this.map = new Map(); // Map insertion tartibini saqlaydi -> LRU shu asosda
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }

    // Yaqinda ishlatilgan -> oxiriga ko'chiramiz
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });

    // Hajm cheklovi: eng eski (birinchi) yozuvlarni o'chiramiz
    while (this.map.size > this.maxSize) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }

  /** Kalit mavjudligini tekshiradi va yo'q bo'lsa qo'shadi. Dedup uchun. */
  addIfAbsent(key) {
    if (this.get(key) !== undefined) return false;
    this.set(key, true);
    return true;
  }

  delete(key) {
    this.map.delete(key);
  }

  /** Muddati o'tgan yozuvlarni tozalaydi (davriy chaqiriladi). */
  prune() {
    const now = Date.now();
    for (const [key, entry] of this.map) {
      if (now > entry.expiresAt) this.map.delete(key);
    }
  }

  get size() {
    return this.map.size;
  }
}

/**
 * Berilgan cache'larni davriy tozalab turadi.
 * Timer `unref` qilingan — process'ni tirik ushlab turmaydi.
 */
function startPruning(caches, intervalMs = 60_000) {
  const timer = setInterval(() => {
    for (const cache of caches) cache.prune();
  }, intervalMs);
  if (typeof timer.unref === 'function') timer.unref();
  return timer;
}

module.exports = { TtlCache, startPruning };
