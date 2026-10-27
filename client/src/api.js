const BASE = '/api/tasks';

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const getTasks = (q = '') => request(`${BASE}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
export const createTask = (task) => request(BASE, { method: 'POST', body: JSON.stringify(task) });
export const updateTask = (id, patch) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
export const deleteTask = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
