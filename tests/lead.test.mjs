import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLeadClient } from '../dist/lead.js';
const fields = { name: 'Hasan', phone: '+998901234567', plan: 'Maslahat', consent: true, website: '', attribution: {} };
const endpoint = 'https://script.google.com/macros/s/test/exec';
const storage = () => { const values = new Map(); return {getItem: k => values.get(k), setItem: (k, v) => values.set(k, v)}; };
const success = p => ({ok: true, json: async () => ({ok: true, requestId: p.requestId})});

test('concurrent submits share one POST and success waits for matching JSON acknowledgment', async () => {
  let finish, calls = 0, posted;
  const client = createLeadClient({fetcher: async (_, options) => {
    calls++; posted = JSON.parse(options.body);
    assert.equal(options.redirect, 'follow');
    assert.equal(options.headers['Content-Type'], 'text/plain;charset=utf-8');
    return {ok: true, json: () => new Promise(resolve => { finish = resolve; })};
  }});
  const a = client.send(endpoint, fields), b = client.send(endpoint, fields);
  assert.equal(a, b);
  await assert.rejects(client.send(endpoint, {...fields, name: 'Jasur'}), /submission_busy/);
  let settled = false; a.then(() => { settled = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(settled, false); assert.equal(calls, 1);
  finish({ok: true, requestId: posted.requestId});
  await a;
});

test('network failure, reload, and switching forms reuse the same request ID', async () => {
  const saved = storage(), ids = [];
  const client = createLeadClient({storage: saved, fetcher: async (_, o) => {
    ids.push(JSON.parse(o.body).requestId); throw new TypeError('Failed to fetch');
  }});
  await assert.rejects(client.send(endpoint, fields));
  const reloaded = createLeadClient({storage: saved, fetcher: async (_, o) => {
    const p = JSON.parse(o.body); ids.push(p.requestId); return success(p);
  }});
  await reloaded.send(endpoint, fields);
  await reloaded.send(endpoint, {...fields, name: 'Jasur'});
  await reloaded.send(endpoint, fields);
  assert.equal(ids[0], ids[1]); assert.equal(ids[0], ids[3]); assert.notEqual(ids[0], ids[2]);
});

test('HTTP, opaque redirect, server rejection, HTML, and wrong ID never report success', async () => {
  for (const response of [
    {ok: false, status: 503}, {ok: false, status: 0, type: 'opaqueredirect'},
    {ok: true, json: async () => ({ok: false, error: 'save_failed'})},
    {ok: true, json: async () => ({ok: true, requestId: 'wrong'})},
    {ok: true, json: async () => {throw new SyntaxError('HTML');}},
    {ok: true, json: async () => null},
  ]) {
    let fail = true;
    const client = createLeadClient({fetcher: async (_, o) => fail ? response : success(JSON.parse(o.body))});
    await assert.rejects(client.send(endpoint, fields));
    fail = false;
    assert.equal((await client.send(endpoint, fields)).ok, true, 'failure releases pending guard');
  }
});

test('timeout aborts request, releases guard and preserves ID for safe retry', async () => {
  const ids = []; let slow = true;
  const client = createLeadClient({timeoutMs: 10, fetcher: async (_, o) => {
    const p = JSON.parse(o.body); ids.push(p.requestId);
    if (!slow) return success(p);
    return new Promise((_, reject) => o.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  }});
  await assert.rejects(client.send(endpoint, fields), {name: 'AbortError'});
  slow = false;
  await client.send(endpoint, fields);
  assert.equal(ids[0], ids[1]);
});

test('unavailable session storage still deduplicates in memory', async () => {
  const ids = [];
  const client = createLeadClient({storage: {getItem() {throw Error();}, setItem() {throw Error();}}, fetcher: async (_, o) => {
    const p = JSON.parse(o.body); ids.push(p.requestId); return success(p);
  }});
  await client.send(endpoint, fields); await client.send(endpoint, fields);
  assert.equal(ids[0], ids[1]);
});
