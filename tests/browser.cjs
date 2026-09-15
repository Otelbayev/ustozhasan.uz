// Local browser QA with a mocked Google response; this is not a live Sheets test.
// Run: python3 -m http.server 4173 --directory dist  &&  node tests/browser.cjs
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4173';

(async () => {
  const browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {})});
  const context = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, permissions: ['clipboard-read', 'clipboard-write']});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let requests = 0, fail = true, sent;
  await page.route('https://script.google.com/macros/s/test/exec', async route => {
    requests++; sent = route.request().postDataJSON();
    if (fail) return route.fulfill({status: 500, headers: {'Access-Control-Allow-Origin': '*'}, body: 'error'});
    // Real Apps Script redirects to a URL containing doPost's JSON acknowledgment.
    await route.fulfill({status: 302, headers: {Location: 'https://script.googleusercontent.com/macros/echo?x=1', 'Access-Control-Allow-Origin': '*'}});
  });

  await page.route('https://script.googleusercontent.com/macros/echo?x=1', route => route.fulfill({status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, body: JSON.stringify({ok: true, requestId: sent.requestId})}));

  await page.goto(`${BASE}/?utm_source=instagram&utm_campaign=course`);
  // Mobile hero: whole portrait, title then CTA then app strip; CTA stays in the first screen.
  // Let entrance animations settle before measuring layout.
  await page.evaluate(() => Promise.all(document.getAnimations().filter(an => an.effect.getComputedTiming().iterations !== Infinity).map(an => an.finished)));
  const heroCta = page.locator('.hero').getByRole('button', {name: 'Kursga yozilish'});
  const [img, cta, strip, h1] = await Promise.all([page.locator('.hero-img').boundingBox(), heroCta.boundingBox(), page.locator('.hero-apps').boundingBox(), page.locator('#hero-title').boundingBox()]);
  assert.ok(img.y < h1.y && h1.y + h1.height <= cta.y + 1 && cta.y + cta.height <= strip.y + 1, 'hero order: image, title, CTA, apps');
  assert.equal(await page.locator('#hero-title').evaluate(el => getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g, '')), 'Montserrat');
  assert.ok(cta.y + cta.height <= 844, `hero CTA above the fold (${cta.y + cta.height})`);
  assert.equal(await page.locator('.hero-apps li').count(), 5);
  await page.waitForFunction(() => document.querySelector('.hero-img').naturalWidth > 0);
  const ratio = await page.locator('.hero-img').evaluate(el => (el.naturalWidth / el.naturalHeight) / (el.clientWidth / el.clientHeight));
  assert.ok(Math.abs(ratio - 1) < 0.02, `hero image not cropped (${ratio})`);

  // Android keyboard (interactive-widget=resizes-content shrinks the viewport): the focused field
  // and the submit button must stay visible, and the sticky CTA must not cover them.
  await page.locator('#ariza').scrollIntoViewIfNeeded();
  await page.locator('#phone').focus();
  await page.setViewportSize({width: 390, height: 430});
  await page.waitForTimeout(900);
  const kb = await page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; };
    return {input: vis(document.querySelector('#phone')), submit: vis(document.querySelector('#ariza [type=submit]')), sticky: getComputedStyle(document.querySelector('.sticky-cta')).transform};
  });
  assert.ok(kb.input && kb.submit, `form visible above keyboard ${JSON.stringify(kb)}`);
  assert.notEqual(kb.sticky, 'none', 'sticky CTA hidden while typing');
  await page.locator('#phone').blur();
  await page.setViewportSize({width: 390, height: 844});
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.hero').getByRole('button', {name: 'Kursga yozilish'}).click();
  await page.locator('#enroll-dialog[open]').waitFor();
  await page.locator('#modal-phone').focus();
  await page.setViewportSize({width: 390, height: 430});
  await page.waitForTimeout(900);
  const modalKb = await page.evaluate(() => { const r = document.querySelector('#enroll-dialog [type=submit]').getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0; });
  assert.ok(modalKb, 'modal submit visible above keyboard');
  await page.keyboard.press('Escape');
  await page.setViewportSize({width: 390, height: 844});

  await page.evaluate(() => { window.LEAD_CONFIG = {endpoint: 'https://script.google.com/macros/s/test/exec'}; });
  await heroCta.click();
  await page.locator('#enroll-dialog[open]').waitFor();
  assert.equal(await page.locator('#modal-title').textContent(), 'Kursga ariza qoldiring');
  await page.locator('#modal-name').fill('Hasan');

  const phone = page.locator('#modal-phone');
  await phone.click();
  assert.equal(await phone.inputValue(), '+998 ');
  await phone.pressSequentially('9a0-1(2)3 45b67');
  assert.equal(await phone.inputValue(), '+998 90 123 45 67', 'letters and symbols are ignored');
  await phone.press('9');
  assert.equal(await phone.inputValue(), '+998 90 123 45 67', '10th digit is ignored');
  for (let i = 0; i < 30; i++) await phone.press('Backspace');
  assert.equal(await phone.inputValue(), '+998 ', 'prefix cannot be deleted');
  await phone.press('1');
  assert.equal(await phone.inputValue(), '+998 ', 'operator code must start with 3-9');

  // Foreign paste is rejected, not converted.
  await page.evaluate(() => navigator.clipboard.writeText('+7 901 234 56 78'));
  await phone.press('ControlOrMeta+V');
  assert.equal(await phone.inputValue(), '+998 ');

  // Autofill that bypasses input events is validated on submit.
  await phone.evaluate(el => { el.value = '+9989012345678'; });
  await page.locator('#enroll-dialog').getByRole('button', {name: 'Ariza yuborish'}).click();
  assert.equal(requests, 0);
  assert.equal(await phone.getAttribute('aria-invalid'), 'true');

  await phone.evaluate(el => { el.value = '+998901234567'; });
  await page.locator('#enroll-dialog').getByRole('button', {name: 'Ariza yuborish'}).click();
  await page.waitForFunction(() => document.querySelector('dialog .form-status').textContent.includes('tasdiqlab bo‘lmad'));
  assert.equal(await phone.inputValue(), '+998 90 123 45 67');
  assert.ok(page.url().includes('utm_source'));

  const id = sent.requestId; fail = false;
  await page.locator('#enroll-dialog').getByRole('button', {name: 'Ariza yuborish'}).click();
  await page.waitForURL('**/thank-you.html?submitted=1');
  assert.equal(sent.requestId, id, 'retry reuses request id');
  assert.equal(sent.phone, '+998901234567');
  assert.equal(sent.plan, 'Maslahat');
  assert.equal(sent.consent, true);
  assert.equal(sent.website, '');
  assert.equal(sent.attribution.utm_source, 'instagram');
  await page.waitForFunction(() => document.querySelector('h1').textContent === 'Rahmat! Arizangiz qabul qilindi.');
  assert.equal(await page.getByRole('link', {name: 'Telegram kanalga qo‘shilish'}).getAttribute('href'), 'https://t.me/Ustoz_Hasan');

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    for (const path of ['/', '/thank-you.html']) {
      await page.goto(BASE + path);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${path} @${width}`);
    }
  }
  for (const path of ['/favicon.ico', '/favicon-32.png', '/assets/logo.png', '/icon-512.png', '/apple-touch-icon.png', '/site.webmanifest', '/robots.txt', '/sitemap.xml', '/og-image.jpg', '/assets/icons3d/word.webp', '/assets/icons3d/google.webp', '/assets/icons3d/capcut.webp', '/assets/hero-480.avif']) {
    assert.equal((await page.request.get(BASE + path)).status(), 200, path);
  }
  await page.goto(BASE + '/');
  assert.equal(await page.locator('main > section').count(), 3, 'only hero, programs and form sections');
  assert.equal(await page.locator('.header nav').count(), 0, 'no header menu');
  assert.deepEqual(errors, []);
  console.log('PASS: hero order/fold + uncropped portrait, keyboard-safe forms, strict +998 mask (letters, 10th digit, prefix, 0-2 code, foreign paste), silent autofill, failure stays on form, safe retry ID, 302 redirect, plan, UTM, thank-you, Telegram URL, no overflow 320-1440, SEO/favicon files. Google responses were mocked.');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
