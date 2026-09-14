// Only +998 XX XXX XX XX is accepted. The operator code starts with 3-9 so the
// client is never looser than the Apps Script check (^\+998[3-9]\d{8}$).
export const UZ_PHONE_RE = /^\+998 [3-9]\d \d{3} \d{2} \d{2}$/;
export const UZ_PREFIX = '+998 ';

// Strict parser for pasted/autofilled values. Never truncates or takes the last
// nine digits, so a foreign number can't silently become an Uzbek one.
export function normalizeUzPhone(value) {
  const raw = String(value ?? '').trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return null;
  const compact = raw.replace(/[\s().-]/g, '');
  let digits;
  if (/^\+998\d{9}$/.test(compact)) digits = compact.slice(4);
  else if (/^998\d{9}$/.test(compact)) digits = compact.slice(3);
  else if (/^\d{9}$/.test(compact)) digits = compact;
  else return null;
  if (!/^[3-9]\d{8}$/.test(digits)) return null;
  return '+998' + digits;
}

export function formatUzPhone(value) {
  const phone = normalizeUzPhone(value);
  return phone ? phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5') : String(value ?? '');
}

// Progressive mask for 0-9 national digits: "90123" -> "+998 90 123".
export function maskUzPhone(digits) {
  const d = String(digits);
  if (!/^\d{0,9}$/.test(d)) return null;
  return UZ_PREFIX + [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
}

// National digits typed after the (possibly damaged) +998 prefix.
function nationalPart(raw) {
  const s = String(raw);
  if (s.startsWith('+998')) return s.slice(4);
  if (s.startsWith('+')) return s.replace(/^\+9?9?8?/, '');
  if (/^998\s/.test(s)) return s.slice(3);
  return s;
}

// Value after a keystroke, or null when the edit must be rejected.
export function maskPhoneInput(raw) {
  const rest = nationalPart(raw);
  if (/[^\d\s]/.test(rest)) return null;
  const digits = rest.replace(/\s/g, '');
  if (digits.length > 9 || (digits && !/^[3-9]/.test(digits))) return null;
  return maskUzPhone(digits);
}

// Value after pasting `text` over [start, end), or null when rejected.
export function pastePhone(current, start, end, text) {
  const full = normalizeUzPhone(text);
  if (full) return formatUzPhone(full);
  if (!/^[\d\s]+$/.test(text)) return null;
  const base = current || UZ_PREFIX;
  return maskPhoneInput(base.slice(0, start) + text + base.slice(end));
}

export function toPayloadPhone(value) {
  return UZ_PHONE_RE.test(value) ? value.replace(/ /g, '') : null;
}

function caretAfterDigits(value, count) {
  if (count <= 0) return UZ_PREFIX.length;
  let seen = 0;
  for (let i = UZ_PREFIX.length; i < value.length; i++) {
    if (/\d/.test(value[i]) && ++seen === count) return i + 1;
  }
  return value.length;
}

function digitsBefore(raw, caret) {
  return nationalPart(raw.slice(0, caret)).replace(/\D/g, '').length;
}

export function attachUzPhoneMask(input, onReject = () => {}) {
  let last = input.value && maskPhoneInput(input.value) || '';
  const reject = reason => { input.value = last; onReject(reason); };

  input.addEventListener('focus', () => {
    if (!input.value) { input.value = last = UZ_PREFIX; }
    requestAnimationFrame(() => { if (input.selectionStart < UZ_PREFIX.length) input.setSelectionRange(input.value.length, input.value.length); });
  });
  input.addEventListener('blur', () => {
    if (input.value.trim() === '+998') { input.value = last = ''; return; }
    const formatted = formatUzPhone(input.value);
    if (formatted !== input.value && UZ_PHONE_RE.test(formatted)) input.value = last = formatted;
  });
  input.addEventListener('beforeinput', event => {
    if (event.inputType === 'insertText' && event.data && /\D/.test(event.data)) { event.preventDefault(); onReject('digits'); }
  });
  input.addEventListener('keydown', event => {
    const { selectionStart: s, selectionEnd: e } = input;
    if (s !== e) return;
    if ((event.key === 'Backspace' && s <= UZ_PREFIX.length) || (event.key === 'Delete' && s < UZ_PREFIX.length)) event.preventDefault();
  });
  input.addEventListener('paste', event => {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData)?.getData('text') ?? '';
    const next = pastePhone(input.value, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, text.trim());
    if (next === null) { onReject('paste'); return; }
    input.value = last = next;
    input.setSelectionRange(next.length, next.length);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  input.addEventListener('input', () => {
    const raw = input.value;
    if (raw === last) return;
    const caret = input.selectionStart ?? raw.length;
    // Autofill may drop a complete number in at once.
    const full = normalizeUzPhone(raw);
    const next = full ? formatUzPhone(full) : maskPhoneInput(raw);
    if (next === null) {
      const back = Math.max(UZ_PREFIX.length, caret - (raw.length - last.length));
      reject(/[^\d\s+]/.test(raw) ? 'digits' : 'length');
      input.setSelectionRange(back, back);
      return;
    }
    input.value = last = next;
    const pos = full ? next.length : caretAfterDigits(next, digitsBefore(raw, caret));
    if (document.activeElement === input) input.setSelectionRange(pos, pos);
  });
}
