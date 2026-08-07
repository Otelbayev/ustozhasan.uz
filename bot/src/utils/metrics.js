/**
 * Eng oddiy hisoblagichlar. Tashqi monitoring tizimisiz ham "bot yaxshi
 * ishlayaptimi?" degan savolga javob berish uchun yetarli.
 *
 * GET /metrics orqali ko'riladi (faqat admin API kaliti bilan).
 */

const counters = {
  updates: 0,
  updates_failed: 0,
  updates_slow: 0,
};

let totalMs = 0;

function recordUpdate({ ms, failed = false }) {
  counters.updates += 1;
  totalMs += ms;
  if (failed) counters.updates_failed += 1;
  if (ms > 2_000) counters.updates_slow += 1;
}

function snapshot() {
  const mem = process.memoryUsage();
  return {
    ...counters,
    avg_update_ms: counters.updates ? Math.round(totalMs / counters.updates) : 0,
    uptime_sec: Math.round(process.uptime()),
    memory_mb: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heap_used: Math.round(mem.heapUsed / 1024 / 1024),
    },
  };
}

module.exports = { recordUpdate, snapshot };
