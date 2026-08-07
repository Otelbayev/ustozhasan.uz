/**
 * Yangi API kalit yaratadi:  npm run api:key
 *
 * Kalitning O'ZI hech qayerda saqlanmaydi — faqat SHA-256 hash .env ga
 * yoziladi. Ya'ni kalitni faqat SHU YERDA, bir marta ko'rasiz.
 * Yo'qotsangiz — yangisini yaratasiz (eski hash'ni ro'yxatdan olib tashlab).
 *
 * Nega bunday: server yoki .env fayl birov qo'liga tushsa ham, hash'dan
 * kalitni tiklab bo'lmaydi — demak API'ga kira olmaydi.
 */

const crypto = require('crypto');

const key = `uh_${crypto.randomBytes(32).toString('base64url')}`;
const hash = crypto.createHash('sha256').update(key, 'utf8').digest('hex');

console.log('');
console.log('  Yangi API kalit yaratildi.');
console.log('');
console.log('  ┌─ KALIT (integratsiya qiluvchi tomonga bering, bir marta ko\'rsatiladi):');
console.log(`  │  ${key}`);
console.log('  └─');
console.log('');
console.log('  .env fayliga qo\'shing (bir nechta kalitni vergul bilan ajrating):');
console.log(`  API_KEYS_SHA256=${hash}`);
console.log('');
console.log('  Sinash:');
console.log(`  curl -H "X-API-Key: ${key}" http://localhost:3000/api/v1/users?limit=2`);
console.log('');
