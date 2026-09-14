// Never truncate a pasted/autofilled number or take its last nine digits.
export function normalizeUzPhone(value) {
  const raw = String(value).trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return null;
  const compact = raw.replace(/[\s().-]/g, '');
  let digits;
  if (/^\+998\d{9}$/.test(compact)) digits = compact.slice(4);
  else if (/^998\d{9}$/.test(compact)) digits = compact.slice(3);
  else if (/^\d{9}$/.test(compact)) digits = compact;
  else return null;
  // Uzbekistan national numbers have a two-digit geographic/operator code.
  if (!/^[3-9]\d{8}$/.test(digits)) return null;
  return '+998' + digits;
}
export function formatUzPhone(value) {
 const phone = normalizeUzPhone(value);
 return phone ? phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5') : value;
}
