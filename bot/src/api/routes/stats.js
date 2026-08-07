/**
 * GET /api/v1/stats — voronka statistikasi.
 *
 * Natija 30 soniyaga cache'lanadi: bu og'ir agregat so'rov va tashqi tizim
 * uni doimiy so'rab tursa, baza ortiqcha yuklanadi.
 */

const express = require('express');
const { getFunnelStats } = require('../../db/stats');

const router = express.Router();

const CACHE_MS = 30_000;
let cached = null;
let cachedAt = 0;

router.get('/', async (req, res, next) => {
  try {
    if (cached && Date.now() - cachedAt < CACHE_MS) {
      res.set('X-Cache', 'HIT');
      return res.json({ data: cached });
    }

    cached = await getFunnelStats();
    cachedAt = Date.now();

    res.set('X-Cache', 'MISS');
    res.json({ data: cached });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
