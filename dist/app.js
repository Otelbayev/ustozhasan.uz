import { UZ_PHONE_RE, attachUzPhoneMask, formatUzPhone, toPayloadPhone } from './phone.js';

const PHONE = '+998 93 305 56 35';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header state on scroll
const header = document.querySelector('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealables.forEach(el => io.observe(el));
} else {
  revealables.forEach(el => el.classList.add('is-in'));
}

// Sticky mobile CTA: visible after the hero, hidden while the lead form is on screen
const sticky = document.querySelector('[data-sticky]');
if (sticky && 'IntersectionObserver' in window) {
  const seen = new Map();
  const update = () => {
    const show = !seen.get('hero') && !seen.get('ariza');
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    sticky.querySelector('button').tabIndex = show ? 0 : -1;
  };
  const so = new IntersectionObserver(entries => {
    for (const e of entries) seen.set(e.target.dataset.watch, e.isIntersecting);
    update();
  });
  const hero = document.querySelector('.hero'); hero.dataset.watch = 'hero'; so.observe(hero);
  const cta = document.querySelector('#ariza'); cta.dataset.watch = 'ariza'; so.observe(cta);
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Enrollment dialog
const dialog = document.querySelector('#enroll-dialog');
const modalTitle = dialog.querySelector('#modal-title');
let opener;
document.querySelectorAll('button[data-plan]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  const plan = button.dataset.plan;
  dialog.querySelector('form').dataset.plan = plan;
  modalTitle.textContent = plan === 'Maslahat' ? 'Kursga ariza qoldiring' : `${plan} tarifiga yozilish`;
  dialog.showModal();
  document.documentElement.classList.add('modal-open');
  // Focus the name field without the mobile keyboard jumping the sheet mid-animation.
  setTimeout(() => dialog.querySelector('input[name=name]').focus({ preventScroll: true }), reduceMotion ? 0 : 320);
}));
dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.documentElement.classList.remove('modal-open'); opener?.focus({ preventScroll: true }); });

// UTM attribution survives in-session navigation
const attribution = {};
const query = new URLSearchParams(location.search);
for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']) attribution[key] = (query.get(key) || '').slice(0, 250);
try {
  if (Object.values(attribution).some(Boolean)) sessionStorage.setItem('ustoz-attribution', JSON.stringify(attribution));
  else Object.assign(attribution, JSON.parse(sessionStorage.getItem('ustoz-attribution') || '{}'));
} catch {}

const NAME_RE = /^[\p{L}\p{M}\s’‘'ʻʼ.-]+$/u;
const shake = el => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };

document.querySelectorAll('.lead-form').forEach(form => {
  const { name, phone, website } = form.elements;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type=submit]');
  let pending = false, requestId = '', lastPayload = '';

  const fail = (input, message) => {
    status.textContent = message;
    if (input) { input.setAttribute('aria-invalid', 'true'); shake(input); input.focus(); }
  };

  for (const input of [name, phone]) input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); status.textContent = ''; });
  let hintTimer;
  attachUzPhoneMask(phone, reason => {
    shake(phone);
    status.textContent = reason === 'paste'
      ? 'Faqat O‘zbekiston raqami qabul qilinadi: +998 XX XXX XX XX.'
      : reason === 'digits' ? 'Faqat raqam kiriting.' : 'Raqam formati: +998 XX XXX XX XX (operator kodi 3–9 bilan boshlanadi).';
    clearTimeout(hintTimer); hintTimer = setTimeout(() => { status.textContent = ''; }, 3200);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    status.textContent = '';

    const cleanName = name.value.trim().replace(/\s+/g, ' ');
    if ((cleanName.match(/\p{L}/gu) || []).length < 2 || cleanName.length > 80 || !NAME_RE.test(cleanName)) {
      return fail(name, 'Iltimos, ismingizni to‘g‘ri kiriting (kamida 2 ta harf).');
    }
    // Read the live value on submit: browser autofill may not dispatch input events.
    const formatted = formatUzPhone(phone.value);
    if (!UZ_PHONE_RE.test(formatted)) {
      return fail(phone, 'Raqamni to‘liq kiriting: +998 XX XXX XX XX. Boshqa davlat raqami qabul qilinmaydi.');
    }
    phone.value = formatted;
    const normalized = toPayloadPhone(formatted);

    const endpoint = window.LEAD_CONFIG?.endpoint;
    if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
      return fail(null, `Ariza xizmati hozircha ulanmagan. Iltimos, ${PHONE} raqamiga qo‘ng‘iroq qiling.`);
    }

    const payloadKey = JSON.stringify([cleanName, normalized, form.dataset.plan]);
    if (payloadKey !== lastPayload) { requestId = crypto.randomUUID(); lastPayload = payloadKey; }
    const payload = { requestId, name: cleanName, phone: normalized, plan: form.dataset.plan, website: website.value, consent: true, attribution };

    pending = true; submit.disabled = true; submit.setAttribute('aria-busy', 'true');
    const previous = submit.innerHTML; submit.textContent = 'Yuborilmoqda…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit', redirect: 'manual', mode: 'cors' });
      // Apps Script answers with a cross-origin 302 to a short-lived googleusercontent URL.
      // A manual redirect is opaque but means the POST reached the Web App; following it
      // would turn the POST into a GET in some browsers and lose the lead.
      if (response.type !== 'opaqueredirect' && !response.ok) throw new Error('HTTP');
      try { sessionStorage.setItem('ustoz-lead-success', String(Date.now())); } catch {}
      location.assign('/thank-you.html?submitted=1');
    } catch {
      fail(null, `Ariza yuborilmadi. Internetni tekshirib, qayta urinib ko‘ring yoki ${PHONE} raqamiga qo‘ng‘iroq qiling.`);
    } finally {
      clearTimeout(timeout); pending = false; submit.disabled = false; submit.removeAttribute('aria-busy'); submit.innerHTML = previous;
    }
  });
});
