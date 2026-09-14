import { normalizeUzPhone, formatUzPhone } from './phone.js';
const visualStyle = document.createElement('link'); visualStyle.rel = 'stylesheet'; visualStyle.href = '/creative.css'; document.head.appendChild(visualStyle);
const heroCopy = document.querySelector('.hero-copy');
if (heroCopy) { heroCopy.querySelector('h1').innerHTML = 'Kompyuterni <span class="zero">0 dan</span> o‘rganing.'; heroCopy.querySelector('h1 + p')?.remove(); heroCopy.querySelector('.mini-stats')?.remove(); const cta = heroCopy.querySelector('.button'); if (cta) cta.childNodes[0].textContent = 'Boshlash '; }
const dialog = document.querySelector('#enroll-dialog');
let opener;
document.querySelectorAll('[data-plan]:not(form)').forEach(button => button.addEventListener('click', () => {
 opener = button;
 const plan = button.dataset.plan;
 dialog.querySelector('form').dataset.plan = plan;
 dialog.querySelector('#modal-title').textContent = plan === 'Maslahat' ? 'Kursga ariza qoldiring' : plan + ' tarifiga yozilish';
 dialog.showModal();
 document.body.style.overflow = 'hidden';
}));
function closeDialog() { dialog.close(); }
dialog.querySelector('.modal-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) {const r = dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) closeDialog();} });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
const attribution = {};
const query = new URLSearchParams(location.search);
for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid']) attribution[key] = (query.get(key) || '').slice(0,250);
try {
 if (Object.values(attribution).some(Boolean)) sessionStorage.setItem('ustoz-attribution', JSON.stringify(attribution));
 else Object.assign(attribution, JSON.parse(sessionStorage.getItem('ustoz-attribution') || '{}'));
} catch {}
document.querySelectorAll('.lead-form').forEach(form => {
 const name = form.elements.name, phone = form.elements.phone, status = form.querySelector('.form-status'), submit = form.querySelector('[type=submit]');
 let pending = false, requestId = '', lastPayload = '';
 for (const input of [name, phone]) input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); status.textContent = ''; });
 phone.addEventListener('blur', () => { phone.value = formatUzPhone(phone.value); });
 form.addEventListener('submit', async event => {
  event.preventDefault(); if (pending) return;
  status.textContent = '';
  const cleanName = name.value.trim().replace(/\s+/g,' ');
  if ((cleanName.match(/\p{L}/gu) || []).length < 2 || cleanName.length < 2 || cleanName.length > 80 || !/^[\p{L}\p{M}\s’‘'ʻʼ.-]+$/u.test(cleanName)) {
   status.textContent = 'Iltimos, ismingizni to‘g‘ri kiriting (kamida 2 ta harf).'; name.setAttribute('aria-invalid','true');name.focus();return;
  }
  // Read live DOM on submit: browser autofill may not dispatch input events.
  const normalized = normalizeUzPhone(phone.value);
  if (!normalized) { status.textContent = 'O‘zbekiston raqamini to‘liq kiriting: +998 90 123 45 67. Boshqa davlat raqami qabul qilinmaydi.';phone.setAttribute('aria-invalid','true');phone.focus();return; }
  const endpoint = window.LEAD_CONFIG?.endpoint;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
   status.textContent = 'Ariza xizmati hozircha ulanmagan. Iltimos, +998 93 305 56 35 raqamiga qo‘ng‘iroq qiling.';return;
  }
  const payloadKey = JSON.stringify([cleanName, normalized, form.dataset.plan]);
  if (payloadKey !== lastPayload) { requestId = crypto.randomUUID(); lastPayload = payloadKey; }
  const payload = {requestId,name:cleanName,phone:normalized,plan:form.dataset.plan,website:form.elements.website.value,consent:true,attribution};
  pending = true;submit.disabled = true;submit.setAttribute('aria-busy','true');
  const previous = submit.innerHTML;submit.textContent = 'Yuborilmoqda…';
  const controller = new AbortController();const timeout = setTimeout(() => controller.abort(),25000);
  try {
   const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',redirect:'manual',mode:'cors'});
   // Apps Script returns a cross-origin 302 to a short-lived googleusercontent URL.
   // A manual redirect is opaque, but means the POST reached the Web App; following
   // it would turn the POST into a GET in some browsers and lose the lead.
   if (response.type !== 'opaqueredirect' && !response.ok) throw new Error('HTTP');
   try { sessionStorage.setItem('ustoz-lead-success',String(Date.now())); } catch {}
   location.assign('/thank-you.html?submitted=1');
  } catch {
   status.textContent = 'Ariza tasdiqlanmadi. Internetni tekshirib, qayta yuboring yoki +998 93 305 56 35 raqamiga qo‘ng‘iroq qiling.';
  } finally {clearTimeout(timeout);pending=false;submit.disabled=false;submit.removeAttribute('aria-busy');submit.innerHTML=previous;}
 });
});
