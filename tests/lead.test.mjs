import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLeadClient } from '../dist/lead.js';

const fields = { name: 'Hasan', phone: '+998901234567', plan: 'Maslahat', consent: true, website: '', attribution: {} };
const endpoint = 'https://script.google.com/macros/s/test/exec';
const storage = () => { const values = new Map(); return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }; };
const ok = payload => ({ ok: true, status: 200, json: async () => ({ ok: true, requestId: payload.requestId }) });
const tick = () => new Promise(resolve => setImmediate(resolve));

test('enqueue returns immediately, persists first, and starts one background POST', async () => {
  const saved = storage(); let resolve; let calls = 0; let posted;
  const client = createLeadClient({ storage: saved, fetcher: async (_, options) => {
    calls++; posted = JSON.parse(options.body); assert.equal(options.keepalive, true); assert.equal(options.redirect, 'follow');
    return new Promise(done => { resolve = done; });
  }});
  const result = client.enqueue(endpoint, fields);
  assert.equal(result.queued, true); assert.ok(result.requestId); assert.equal(calls, 1);
  assert.ok(saved.getItem('ustoz-lead-outbox-v1').includes(result.requestId));
  assert.equal(client.enqueue(endpoint, fields).requestId, result.requestId); assert.equal(calls, 1);
  resolve(ok(posted)); await tick(); await tick();
  assert.deepEqual(JSON.parse(saved.getItem('ustoz-lead-outbox-v1')), []);
});

test('failed background delivery stays in durable outbox and retries with the same ID', async () => {
  const saved = storage(); const ids = []; let fail = true;
  const client = createLeadClient({ storage: saved, fetcher: async (_, options) => {
    const payload = JSON.parse(options.body); ids.push(payload.requestId);
    if (fail) return { ok: false, status: 503 };
    return ok(payload);
  }});
  const first = client.enqueue(endpoint, fields); await tick();
  assert.ok(saved.getItem('ustoz-lead-outbox-v1').includes(first.requestId));
  fail = false; client.flush(); await tick(); await tick();
  assert.deepEqual(JSON.parse(saved.getItem('ustoz-lead-outbox-v1')), []); assert.deepEqual(ids, [first.requestId, first.requestId]);
});

test('reload preserves the queued ID and different lead gets a different ID', async () => {
  const saved = storage(); const ids = [];
  const client = createLeadClient({ storage: saved, fetcher: async (_, options) => { const p = JSON.parse(options.body); ids.push(p.requestId); return { ok: false, status: 0 }; } });
  const first = client.enqueue(endpoint, fields); await tick();
  const reloaded = createLeadClient({ storage: saved, fetcher: async (_, options) => { const p = JSON.parse(options.body); ids.push(p.requestId); return ok(p); } });
  reloaded.flush(); reloaded.enqueue(endpoint, { ...fields, name: 'Jasur' }); await tick(); await tick();
  assert.equal(ids[0], first.requestId); assert.equal(ids[1], first.requestId); assert.notEqual(ids[2], first.requestId);
});

test('server rejection, malformed JSON, and wrong ID never delete the outbox', async () => {
  for (const response of [
    { ok: true, status: 200, json: async () => ({ ok: false, error: 'save_failed' }) },
    { ok: true, status: 200, json: async () => ({ ok: true, requestId: 'wrong' }) },
    { ok: true, status: 200, json: async () => { throw new SyntaxError('HTML'); } },
  ]) {
    const saved = storage();
    const client = createLeadClient({ storage: saved, fetcher: async () => response });
    const result = client.enqueue(endpoint, fields); await tick();
    assert.ok(saved.getItem('ustoz-lead-outbox-v1').includes(result.requestId));
  }
});

test('storage failure is reported and does not show a false queued success', () => {
  const broken = { getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('blocked'); } };
  const client = createLeadClient({ storage: broken, fetcher: async () => ok({ requestId: 'unused' }) });
  assert.throws(() => client.enqueue(endpoint, fields), /storage_unavailable/);
});
