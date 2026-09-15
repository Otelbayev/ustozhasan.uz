import { UZ_PHONE_RE, attachUzPhoneMask, formatUzPhone, toPayloadPhone } from './phone.js';
import { createLeadClient } from './lead.js';

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

// On-screen keyboard: keep the focused field and the submit button visible.
// Chrome on Android resizes the layout viewport (interactive-widget=resizes-content);
// iOS Safari and other browsers only shrink the visual viewport, so expose its height.
const root = document.documentElement;
const vv = window.visualViewport;
if (vv) {
  const syncKeyboard = () => {
    const kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
    root.style.setProperty('--kb', `${kb}px`);
  };
  vv.addEventListener('resize', syncKeyboard);
  vv.addEventListener('scroll', syncKeyboard);
}
let revealTimer;
const revealForm = field => {
  clearTimeout(revealTimer);
  // Wait for the keyboard animation, then scroll the rest of the form into view.
  revealTimer = setTimeout(() => {
    if (document.activeElement !== field) return;
    const submit = field.form?.querySelector('[type=submit]') || field;
    const view = vv ? vv.height : window.innerHeight;
    const inDialog = field.closest('dialog');
    const scroller = inDialog || document.scrollingElement;
    const top = inDialog ? inDialog.getBoundingClientRect().top : header.getBoundingClientRect().bottom;
    const bottom = inDialog ? Math.min(inDialog.getBoundingClientRect().bottom, view) : view;
    // One scroll that brings the submit button above the keyboard without pushing the field under the header.
    const need = submit.getBoundingClientRect().bottom + 12 - bottom;
    const room = field.getBoundingClientRect().top - 12 - top;
    const delta = need > 0 ? Math.min(need, Math.max(0, room)) : Math.min(0, room);
    if (delta) scroller.scrollBy({ top: delta, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, 350);
};
// While typing, the sticky CTA would sit right above the keyboard and cover the form.
document.addEventListener('focusin', event => {
  if (!event.target.matches?.('.lead-form input')) return;
  root.classList.add('is-typing');
  revealForm(event.target);
});
document.addEventListener('focusout', event => {
  if (event.target.matches?.('.lead-form input')) setTimeout(() => { if (!document.activeElement?.matches('.lead-form input')) root.classList.remove('is-typing'); }, 100);
});
vv?.addEventListener('resize', () => {
  if (document.activeElement?.matches('.lead-form input')) revealForm(document.activeElement);
});

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
let leadStorage;
try { leadStorage = sessionStorage; } catch {}
const leads = createLeadClient({ storage: leadStorage });
const leadForms = [...document.querySelectorAll('.lead-form')];
let submissionPending = false;
let releaseSubmission = () => {};
addEventListener('pageshow', event => { if (event.persisted) releaseSubmission(); });

leadForms.forEach(form => {
  const { name, phone, website } = form.elements;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type=submit]');

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
    if (submissionPending) return;
    clearTimeout(hintTimer);
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

    const payload = { name: cleanName, phone: normalized, plan: form.dataset.plan, website: website.value, consent: true, attribution };

    submissionPending = true;
    const buttons = leadForms.map(f => f.querySelector('[type=submit]'));
    const disabledBefore = buttons.map(button => button.disabled);
    releaseSubmission = () => {
      submissionPending = false;
      buttons.forEach((button, index) => { button.disabled = disabledBefore[index]; });
    };
    buttons.forEach(button => { button.disabled = true; });
    submit.setAttribute('aria-busy', 'true');
    const previous = submit.innerHTML; submit.textContent = 'Yuborilmoqda…';
    let saved = false;
    try {
      await leads.send(endpoint, payload);
      saved = true;
      clearTimeout(hintTimer);
      form.reset();
      for (const input of [name, phone]) input.removeAttribute('aria-invalid');
      status.textContent = 'Rahmat! Arizangiz qabul qilindi.';
      try { sessionStorage.setItem('ustoz-lead-success', String(Date.now())); } catch {}
      location.assign('/thank-you.html?submitted=1');
    } catch (error) {
      if (saved) {
        console.error('[Ustoz Hasan] Ariza saqlandi, lekin rahmat sahifasini ochib bo‘lmadi.');
        releaseSubmission();
        return;
      }
      // Log a bounded diagnostic, never the name, phone, endpoint or response body.
      const code = error?.name === 'AbortError' ? 'timeout' : error?.message;
      const known = /^(http_\d{3}|invalid_response|request_id_mismatch|invalid_request|validation|not_configured|busy|run_setup|save_failed|submission_busy|timeout)$/;
      console.error('[Ustoz Hasan] Ariza saqlanganini tasdiqlab bo‘lmadi:', known.test(code) ? code : 'network_error');
      fail(null, `Ariza yuborilganini tasdiqlab bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring yoki ${PHONE} raqamiga qo‘ng‘iroq qiling.`);
    } finally {
      submit.removeAttribute('aria-busy'); submit.innerHTML = previous;
      // Keep both buttons locked until navigation after success; unlock on failure.
      if (!saved) releaseSubmission();
    }
  });
});
