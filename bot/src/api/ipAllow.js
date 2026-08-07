/**
 * IP oq ro'yxati (allowlist), CIDR qo'llab-quvvatlanadi.
 *
 * API kalit — birinchi himoya qatlami. IP cheklovi — ikkinchisi: kalit
 * o'g'irlansa ham, u faqat sizning serveringiz IP sidan ishlaydi.
 *
 * .env: API_ALLOWED_IPS=203.0.113.10,10.0.0.0/8,2001:db8::/32
 * Bo'sh qoldirilsa tekshiruv o'chadi (local development uchun).
 */

/** "::ffff:203.0.113.10" -> "203.0.113.10" */
function normalize(ip) {
  if (!ip) return '';
  const trimmed = ip.trim();
  const mapped = trimmed.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  return mapped ? mapped[1] : trimmed;
}

function ipv4ToInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  let value = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    value = value * 256 + octet;
  }
  return value;
}

/** IPv6 ni 128-bitli BigInt ga aylantiradi (qisqartirilgan "::" bilan ham). */
function ipv6ToBigInt(ip) {
  const [head, tail] = ip.split('::');
  const headParts = head ? head.split(':').filter(Boolean) : [];
  const tailParts = tail ? tail.split(':').filter(Boolean) : [];

  if (ip.includes('::')) {
    const missing = 8 - headParts.length - tailParts.length;
    if (missing < 0) return null;
    headParts.push(...Array(missing).fill('0'), ...tailParts);
  }
  if (headParts.length !== 8) return null;

  let value = 0n;
  for (const part of headParts) {
    if (!/^[0-9a-f]{1,4}$/i.test(part)) return null;
    value = (value << 16n) + BigInt(parseInt(part, 16));
  }
  return value;
}

function matches(ip, rule) {
  const [network, prefixRaw] = rule.split('/');
  const isV6 = ip.includes(':') || network.includes(':');

  if (isV6) {
    const addr = ipv6ToBigInt(ip);
    const net = ipv6ToBigInt(network);
    if (addr === null || net === null) return false;

    const prefix = prefixRaw === undefined ? 128 : Number(prefixRaw);
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 128) return false;

    const mask = prefix === 0 ? 0n : ((1n << BigInt(prefix)) - 1n) << BigInt(128 - prefix);
    return (addr & mask) === (net & mask);
  }

  const addr = ipv4ToInt(ip);
  const net = ipv4ToInt(network);
  if (addr === null || net === null) return false;

  const prefix = prefixRaw === undefined ? 32 : Number(prefixRaw);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return false;

  // >>> 0 — JS bitli amallari 32-bit imzoli sonlar bilan ishlaydi
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return ((addr & mask) >>> 0) === ((net & mask) >>> 0);
}

/**
 * @param {string} ip
 * @param {string[]} rules  bo'sh massiv => hammaga ruxsat
 */
function isAllowed(ip, rules) {
  if (!rules || rules.length === 0) return true;
  const normalized = normalize(ip);
  return rules.some((rule) => matches(normalized, rule.trim()));
}

module.exports = { isAllowed, normalize };
