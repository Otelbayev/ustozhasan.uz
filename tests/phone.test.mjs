import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeUzPhone, formatUzPhone, maskUzPhone, maskPhoneInput, pastePhone, toPayloadPhone, UZ_PHONE_RE} from '../dist/phone.js';

test('Uzbek full and national formats normalize without losing digits', () => {
  for (const s of ['+998 90 123 45 67', '998901234567', '90 123 45 67', '(90) 123-45-67']) assert.equal(normalizeUzPhone(s), '+998901234567');
  assert.equal(formatUzPhone('901234567'), '+998 90 123 45 67');
});

test('foreign, malformed and overlong autofills are rejected rather than truncated', () => {
  for (const s of ['+7 901 234 56 78', '+1 998 901 2345', '+9989012345678', '+99890123456', '+901234567', '00998901234567', '+998+901234567', '+998 90 abc 45 67', '', '123456789', '998901234567 ext 1']) assert.equal(normalizeUzPhone(s), null, s);
  const foreign = '+7 901 234 56 78'; assert.equal(formatUzPhone(foreign), foreign);
});

test('only +998 XX XXX XX XX passes the final regex', () => {
  for (const ok of ['+998 90 123 45 67', '+998 33 000 00 00', '+998 99 999 99 99']) assert.ok(UZ_PHONE_RE.test(ok), ok);
  for (const bad of ['+998901234567', '+998 90 1234567', '+998 20 123 45 67', '+998 90 123 45 6', '+998 90 123 45 678', ' +998 90 123 45 67', '+998 90 123 45 67 ', '+7 901 234 56 78', '90 123 45 67']) assert.equal(UZ_PHONE_RE.test(bad), false, bad);
});

test('progressive mask while typing', () => {
  assert.equal(maskUzPhone(''), '+998 ');
  assert.equal(maskUzPhone('9'), '+998 9');
  assert.equal(maskUzPhone('90123'), '+998 90 123');
  assert.equal(maskUzPhone('901234567'), '+998 90 123 45 67');
  assert.equal(maskUzPhone('9012345678'), null);
  assert.equal(maskPhoneInput('+998 90 1234'), '+998 90 123 4');
  assert.equal(maskPhoneInput('9'), '+998 9');
  assert.equal(maskPhoneInput('+99 90 123'), '+998 90 123');
});

test('typing rejects letters, symbols, a 10th digit and codes starting 0-2', () => {
  for (const raw of ['+998 9a', '+998 90-1', '+998 90 123 45 678', '+998 1', '+998 0', '+998 2', '+998 90 123 45 67+']) assert.equal(maskPhoneInput(raw), null, raw);
});

test('paste accepts a full Uzbek number or digits that fit, rejects the rest', () => {
  assert.equal(pastePhone('+998 ', 5, 5, '+998 90 123 45 67'), '+998 90 123 45 67');
  assert.equal(pastePhone('+998 ', 5, 5, '901234567'), '+998 90 123 45 67');
  assert.equal(pastePhone('+998 90', 7, 7, '1234567'), '+998 90 123 45 67');
  for (const text of ['+7 901 234 56 78', '9012345678', 'salom', '+998 90 123 45 678']) assert.equal(pastePhone('+998 ', 5, 5, text), null, text);
});

test('payload phone matches the Apps Script contract', () => {
  assert.equal(toPayloadPhone('+998 90 123 45 67'), '+998901234567');
  assert.match(toPayloadPhone('+998 33 305 56 35'), /^\+998[3-9]\d{8}$/);
  assert.equal(toPayloadPhone('+998 90 123'), null);
});
