const BASE = 'http://localhost:5000/api';

// ── Helpers ────────────────────────────────────────────────────────────
const get = (url) => fetch(url).then(r => r.json());
const post = (url, body) => fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json());
const put = (url, body) => fetch(url, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json());
const patch = (url, body) => fetch(url, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json());
const del = (url) => fetch(url, { method: 'DELETE' }).then(r => r.json());

// ── Customer-facing ────────────────────────────────────────────────────
export const fetchMenuItems = () => get(`${BASE}/menu`);
export const fetchCategories = () => get(`${BASE}/menu/categories`);
export const placeOrder = (data) => post(`${BASE}/orders`, data);
export const createReservation = (data) => post(`${BASE}/reservations`, data);

// ── Admin: Stats ───────────────────────────────────────────────────────
export const fetchAdminStats = () => get(`${BASE}/admin/stats`);

// ── Admin: Orders ──────────────────────────────────────────────────────
export const fetchAdminOrders = () => get(`${BASE}/admin/orders`);
export const updateOrderStatus = (id, status) => patch(`${BASE}/admin/orders/${id}`, { status });
export const deleteOrder = (id) => del(`${BASE}/admin/orders/${id}`);

// ── Admin: Menu ────────────────────────────────────────────────────────
export const fetchAllMenuItems = () => get(`${BASE}/menu/all`);
export const createMenuItem = (data) => post(`${BASE}/menu`, data);
export const updateMenuItem = (id, data) => put(`${BASE}/menu/${id}`, data);
export const deleteMenuItem = (id) => del(`${BASE}/menu/${id}`);

// ── Admin: Reservations ────────────────────────────────────────────────
export const fetchAdminReservations = () => get(`${BASE}/reservations`);
export const updateReservation = (id, data) => patch(`${BASE}/reservations/${id}`, data);
export const deleteReservation = (id) => del(`${BASE}/reservations/${id}`);

// ── Admin: Upload ──────────────────────────────────────────────────────
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE}/upload`, { method: 'POST', body: formData }).then(r => r.json());
};
