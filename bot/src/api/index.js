/**
 * API marshrutlarini yig'adi.
 *
 * Himoya tartibi:
 *   /api/v1/leads  — ochiq (brauzerdan chaqiriladi), Origin + IP limit bilan
 *   qolgan hammasi — X-API-Key + IP allowlist + rate limit
 */

const express = require('express');
const { apiAuth } = require('./auth');
const { httpRateLimit } = require('./rateLimit');
const usersRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');
const leadsRoutes = require('./routes/leads');
const logger = require('../utils/logger');
const { IS_PRODUCTION } = require('../config');

const router = express.Router();

// Ochiq endpoint — o'z himoyasi ichida
router.use('/leads', leadsRoutes);

// Undan keyingi hamma narsa autentifikatsiya talab qiladi
router.use(apiAuth());
router.use(httpRateLimit({ windowMs: 60_000, max: 60 }));

router.use('/users', usersRoutes);
router.use('/stats', statsRoutes);

// Noma'lum API yo'li
router.use((req, res) => {
  res.status(404).json({ error: 'Bunday endpoint yo\'q' });
});

// Xatolar uchun yagona to'siq: tashqariga stack trace yoki SQL matni chiqmaydi
router.use((err, req, res, _next) => {
  logger.error('API xatosi', { path: req.originalUrl, key: req.apiKeyId, err });

  res.status(500).json({
    error: 'Server xatosi',
    // Localda ishlashni osonlashtirish uchun tafsilot beriladi, productionda — yo'q
    ...(IS_PRODUCTION ? {} : { detail: err.message }),
  });
});

module.exports = router;
