// One client is shared by both forms. Keep IDs across retries and page reloads.
export function createLeadClient({ fetcher = fetch, storage, uuid = () => crypto.randomUUID(), timeoutMs = 25000 } = {}) {
  const storageKey = 'ustoz-lead-requests';
  let records = [], active;
  try { records = JSON.parse(storage?.getItem(storageKey) || '[]'); } catch {}
  if (!Array.isArray(records)) records = [];
  records = records.filter(r => r && typeof r.key === 'string' && typeof r.id === 'string').slice(-20);

  function send(endpoint, fields) {
    const key = JSON.stringify([endpoint, fields.name, fields.phone, fields.plan]);
    if (active) {
      if (active.key === key) return active.promise;
      return Promise.reject(new Error('submission_busy'));
    }
    let record = records.find(r => r.key === key);
    if (!record) {
      record = { key, id: uuid() };
      records = [...records.slice(-19), record];
      try { storage?.setItem(storageKey, JSON.stringify(records)); } catch {}
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const promise = (async () => {
      try {
        // The redirected GET retrieves doPost's JSON; it does not repeat the write.
        const response = await fetcher(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...fields, requestId: record.id }),
          signal: controller.signal, credentials: 'omit', redirect: 'follow', mode: 'cors',
        });
        if (!response.ok) throw new Error(`http_${response.status}`);
        let result;
        try { result = await response.json(); } catch (error) {
          if (controller.signal.aborted) throw error;
          throw new Error('invalid_response');
        }
        if (result?.ok !== true) {
          const code = ['invalid_request', 'validation', 'not_configured', 'busy', 'run_setup', 'save_failed'].includes(result?.error)
            ? result.error : 'invalid_response';
          throw new Error(code);
        }
        if (result.requestId !== record.id) throw new Error('request_id_mismatch');
        return result;
      } finally {
        clearTimeout(timeout);
      }
    })();
    active = { key, promise };
    const clear = () => { active = undefined; };
    promise.then(clear, clear);
    return promise;
  }
  return { send };
}
