const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: ({ email, password, name, role }) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, role }) }),

  syncUser: (userData) =>
    request('/api/users/sync', { method: 'POST', body: JSON.stringify(userData) }),

  // Users CRUD
  getUsers: () => request('/api/users'),

  getUser: (uid) => request(`/api/users/${uid}`),

  createUser: (data) =>
    request('/api/users', { method: 'POST', body: JSON.stringify(data) }),

  updateUser: (uid, data) =>
    request(`/api/users/${uid}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteUser: (uid) =>
    request(`/api/users/${uid}`, { method: 'DELETE' }),

  // Audit
  getAuditLog: (limit = 100) => request(`/api/audit?limit=${limit}`),
}
