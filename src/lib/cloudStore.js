// Shared cloud store sync.
//
// In the production deployment, the SIARM app is served by scripts/serve.mjs,
// which exposes a tiny REST endpoint at /api/store backed by a JSON file on the
// server. This lets every device that opens the app share the SAME live data
// (announcements, enrolments, payments, grades, …) instead of each browser
// keeping its own isolated localStorage copy.
//
// The functions degrade gracefully: if the API is unavailable (e.g. during
// `vite dev`, or while offline), they simply no-op and the app falls back to
// localStorage — so the app keeps working everywhere.

const API = '/api/store'

// Fetch the shared store from the server. Returns the parsed object, or null
// when there is nothing stored yet or the endpoint is unreachable.
export async function loadCloud() {
  try {
    const res = await fetch(API, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (data && typeof data === 'object' && Object.keys(data).length) return data
    return null
  } catch {
    return null
  }
}

// Debounced save of the shared store back to the server.
let timer = null
export function saveCloud(store) {
  try {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
        keepalive: true,
      }).catch(() => {})
    }, 600)
  } catch {
    /* ignore — falls back to localStorage */
  }
}
