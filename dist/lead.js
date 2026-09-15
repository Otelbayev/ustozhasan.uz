// Durable, non-blocking lead outbox. The form never waits for Apps Script.
// A request ID makes every retry idempotent on the Apps Script side.
export function createLeadClient({
  fetcher = globalThis.fetch,
  beacon = globalThis.navigator?.sendBeacon?.bind(globalThis.navigator),
  storage,
  uuid = () => crypto.randomUUID(),
} = {}) {
  const storageKey = 'ustoz-lead-outbox-v1';
  const inFlight = new Set();
  let records = [];

  const read = () => {
    try {
      const value = JSON.parse(storage?.getItem(storageKey) || '[]');
      return Array.isArray(value) ? value.filter(record => record?.id && record?.endpoint && record?.fields) : [];
    } catch { return []; }
  };
  const write = () => {
    try { storage?.setItem(storageKey, JSON.stringify(records.slice(-20))); return true; }
    catch (error) { console.error('[Ustoz Hasan] Ariza outbox’ini saqlab bo‘lmadi:', error?.message || 'storage_error'); return false; }
  };
  records = read();

  const logFailure = error => {
    const code = error?.name === 'AbortError' ? 'timeout' : error?.message;
    const safe = /^(http_\d{3}|invalid_response|request_id_mismatch|invalid_request|validation|not_configured|busy|run_setup|save_failed)$/;
    console.error('[Ustoz Hasan] Ariza fon rejimida saqlanmadi:', safe.test(code) ? code : 'network_error');
  };
  const remove = id => { records = records.filter(record => record.id !== id); write(); };

  const acknowledge = async (record, response) => {
    if (!response?.ok) throw new Error(`http_${response?.status || 0}`);
    let result;
    try { result = await response.json(); } catch { throw new Error('invalid_response'); }
    if (result?.ok !== true) throw new Error(result?.error || 'invalid_response');
    if (result.requestId !== record.id) throw new Error('request_id_mismatch');
    remove(record.id);
  };

  const flushRecord = record => {
    if (inFlight.has(record.id)) return;
    inFlight.add(record.id);
    const body = JSON.stringify({ ...record.fields, requestId: record.id });
    let request;
    try {
      request = fetcher(record.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body,
        keepalive: true, credentials: 'omit', redirect: 'follow', mode: 'cors',
      });
    } catch (error) { request = Promise.reject(error); }
    Promise.resolve(request).then(response => acknowledge(record, response)).catch(logFailure)
      .finally(() => inFlight.delete(record.id));
  };
  const flush = () => records.slice().forEach(flushRecord);

  const enqueue = (endpoint, fields) => {
    const key = JSON.stringify([endpoint, fields.name, fields.phone, fields.plan]);
    let record = records.find(item => item.key === key);
    if (!record) {
      record = { key, id: uuid(), endpoint, fields: { ...fields } };
      records = [...records.slice(-19), record];
      if (!write()) throw new Error('storage_unavailable');
    }
    flushRecord(record);
    return { queued: true, requestId: record.id };
  };

  // Compatibility alias for code that used the former client API.
  return { enqueue, send: enqueue, flush };
}
