/**
 * Offline action queue for SIARM.
 *
 * When the user takes an action while the network is unreachable
 * (mark attendance, enter a grade, simulate a payment), the action
 * is appended to a queue persisted in localStorage. As soon as the
 * browser reports `online`, the queue is flushed: each action is
 * replayed against the configured handler.
 *
 * For the bachelor demonstration mode there is no real back-end, so
 * "replay" means re-applying the action to localStorage state via
 * DataContext. In production the same queue would drive a Firestore
 * batched write.
 */
const KEY = 'siarm.offlineQueue.v1'

/* ─── persistence ─────────────────────────────────────────── */
function readQ() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
function writeQ(q) {
  try { localStorage.setItem(KEY, JSON.stringify(q)) } catch { /* quota exceeded */ }
  // Fire a custom event so listeners can re-render their badges
  try { window.dispatchEvent(new CustomEvent('siarm:queueChanged', { detail: { length: q.length } })) } catch { /* SSR */ }
}

/* ─── public API ──────────────────────────────────────────── */
export function enqueue(action) {
  const q = readQ()
  q.push({ id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`, queuedAt: new Date().toISOString(), ...action })
  writeQ(q)
  return q.length
}

export function peek() { return readQ() }

export function size() { return readQ().length }

export function clear() { writeQ([]) }

export function remove(id) {
  writeQ(readQ().filter((a) => a.id !== id))
}

/**
 * Flush the queue using the supplied handler.
 *   handler(action) -> Promise<void>
 * Successfully handled actions are removed; failures are kept for retry.
 * Returns { applied, failed }.
 */
export async function flush(handler) {
  const q = readQ()
  let applied = 0, failed = 0
  const remaining = []
  for (const action of q) {
    try {
      await handler(action)
      applied++
    } catch (err) {
      failed++
      remaining.push({ ...action, lastError: String(err?.message || err) })
    }
  }
  writeQ(remaining)
  return { applied, failed }
}

/* ─── auto-flush on reconnection ──────────────────────────── */
export function installAutoFlush(handler) {
  const tryFlush = async () => {
    if (!navigator.onLine || readQ().length === 0) return
    await flush(handler)
  }
  window.addEventListener('online', tryFlush)
  // Also try every 30 s in case the online event was missed
  const id = setInterval(tryFlush, 30_000)
  return () => {
    window.removeEventListener('online', tryFlush)
    clearInterval(id)
  }
}
