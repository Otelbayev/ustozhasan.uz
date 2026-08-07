/**
 * Voronka statistikasi. Ikki joyda ishlatiladi: admin uchun /stats buyrug'i
 * va integratsiya uchun GET /api/v1/stats.
 */

const pool = require('./pool');

async function getFunnelStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)::int                                                        AS total_users,
      COUNT(*) FILTER (WHERE is_subscribed)::int                           AS subscribed,
      COUNT(*) FILTER (WHERE phone_number IS NOT NULL)::int                AS with_phone,
      COUNT(*) FILTER (WHERE blocked_bot)::int                             AS blocked,
      COUNT(*) FILTER (WHERE is_premium)::int                              AS premium,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours')::int AS new_24h,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int   AS new_7d,
      COUNT(*) FILTER (WHERE last_seen_at >= NOW() - INTERVAL '24 hours')::int AS active_24h
    FROM users
  `);

  const byStage = await pool.query(`
    SELECT funnel_stage, COUNT(*)::int AS count
      FROM users
     GROUP BY funnel_stage
  `);

  const bySource = await pool.query(`
    SELECT COALESCE(source, 'direct') AS source, COUNT(*)::int AS count
      FROM users
     GROUP BY 1
     ORDER BY count DESC
     LIMIT 20
  `);

  // Oxirgi 30 kun — admin paneldagi grafik uchun. generate_series bilan
  // bo'sh kunlar ham 0 qiymat bilan chiqadi (grafikda uzilish bo'lmasin).
  const daily = await pool.query(`
    SELECT d.day::date AS date,
           COUNT(u.id)::int AS new_users,
           COUNT(u.id) FILTER (WHERE u.phone_number IS NOT NULL)::int AS with_phone
      FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') AS d(day)
      LEFT JOIN users u ON u.created_at >= d.day AND u.created_at < d.day + INTERVAL '1 day'
     GROUP BY d.day
     ORDER BY d.day
  `);

  const events = await pool.query(`
    SELECT event_type, COUNT(*)::int AS count
      FROM funnel_events
     GROUP BY event_type
     ORDER BY count DESC
  `);

  const base = rows[0];
  const pct = (part) => (base.total_users ? Number(((part / base.total_users) * 100).toFixed(1)) : 0);

  return {
    ...base,
    by_stage: Object.fromEntries(byStage.rows.map((r) => [r.funnel_stage, r.count])),
    by_source: Object.fromEntries(bySource.rows.map((r) => [r.source, r.count])),
    by_event: Object.fromEntries(events.rows.map((r) => [r.event_type, r.count])),
    daily: daily.rows.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      new_users: r.new_users,
      with_phone: r.with_phone,
    })),
    conversion: {
      subscribed_pct: pct(base.subscribed),
      phone_pct: pct(base.with_phone),
    },
    generated_at: new Date().toISOString(),
  };
}

module.exports = { getFunnelStats };
