import apiClient from './api';

export type AdminRange = 'today' | 'week' | 'month';

// ── Products ──────────────────────────────────────────────────────────────────
export const fetchAdminProducts = () =>
  apiClient.get('/products/admin/all').then((r) => r.data.data);

export const createProduct = (payload: Record<string, any>) =>
  apiClient.post('/products/admin', payload).then((r) => r.data.data);

export const updateProduct = (id: string, payload: Record<string, any>) =>
  apiClient.put(`/products/admin/${id}`, payload).then((r) => r.data.data);

export const toggleProductActive = (id: string) =>
  apiClient.patch(`/products/admin/${id}/toggle`).then((r) => r.data.data);

export const deleteProduct = (id: string) =>
  apiClient.delete(`/products/admin/${id}`).then((r) => r.data.data);

// ── Categories ───────────────────────────────────────────────────────────────
export const fetchAdminCategories = () =>
  apiClient.get('/categories/admin/all').then((r) => r.data.data);

export const createCategory = (payload: Record<string, any>) =>
  apiClient.post('/categories/admin', payload).then((r) => r.data.data);

export const updateCategory = (id: string, payload: Record<string, any>) =>
  apiClient.put(`/categories/admin/${id}`, payload).then((r) => r.data.data);

export const toggleCategoryActive = (id: string) =>
  apiClient.patch(`/categories/admin/${id}/toggle`).then((r) => r.data.data);

export const deleteCategory = (id: string) =>
  apiClient.delete(`/categories/admin/${id}`).then((r) => r.data.data);

// ── Additionals ──────────────────────────────────────────────────────────────
export const fetchAdminAddons = () =>
  apiClient.get('/additionals/admin/all').then((r) => r.data.data);

export const createAddon = (payload: Record<string, any>) =>
  apiClient.post('/additionals/admin', payload).then((r) => r.data.data);

export const updateAddon = (id: string, payload: Record<string, any>) =>
  apiClient.put(`/additionals/admin/${id}`, payload).then((r) => r.data.data);

export const toggleAddonActive = (id: string) =>
  apiClient.patch(`/additionals/admin/${id}/toggle`).then((r) => r.data.data);

export const deleteAddon = (id: string) =>
  apiClient.delete(`/additionals/admin/${id}`).then((r) => r.data.data);

// ── Orders ───────────────────────────────────────────────────────────────────
export const fetchAdminOrders = (status?: string) => {
  const url = status ? `/orders/admin?status=${status}` : '/orders/admin';
  return apiClient.get(url).then((r) => r.data.data.orders || []);
};

export const updateOrderStatus = (id: string, status: string) =>
  apiClient.patch(`/orders/admin/${id}/status`, { status }).then((r) => r.data.data);

export const updateOrderDeliveryCost = (id: string, deliveryCost: number) =>
  apiClient.put(`/orders/admin/${id}/delivery-cost`, { deliveryCost }).then((r) => r.data.data);

export const deleteOrder = (id: string) =>
  apiClient.delete(`/orders/admin/${id}`).then((r) => r.data.data);

export const fetchOrderStats = () =>
  apiClient.get('/orders/admin/stats').then((r) => r.data.data);

// ── Coupons ──────────────────────────────────────────────────────────────────
export const fetchAdminCoupons = () =>
  apiClient.get('/coupons/admin').then((r) => r.data.data);

export const createCoupon = (payload: Record<string, any>) =>
  apiClient.post('/coupons/admin', payload).then((r) => r.data.data);

export const updateCoupon = (id: string, payload: Record<string, any>) =>
  apiClient.put(`/coupons/admin/${id}`, payload).then((r) => r.data.data);

export const toggleCouponActive = (id: string) =>
  apiClient.patch(`/coupons/admin/${id}/toggle`).then((r) => r.data.data);

export const deleteCoupon = (id: string) =>
  apiClient.delete(`/coupons/admin/${id}`).then((r) => r.data.data);

// ── Banners ──────────────────────────────────────────────────────────────────
export const fetchAdminBanners = () =>
  apiClient.get('/banners/admin/all').then((r) => r.data.data);

export const createBanner = (payload: Record<string, any>) =>
  apiClient.post('/banners/admin', payload).then((r) => r.data.data);

export const updateBanner = (id: string, payload: Record<string, any>) =>
  apiClient.put(`/banners/admin/${id}`, payload).then((r) => r.data.data);

export const toggleBannerActive = (id: string) =>
  apiClient.put(`/banners/admin/${id}/toggleActive`).then((r) => r.data.data);

export const deleteBanner = (id: string) =>
  apiClient.delete(`/banners/admin/${id}`).then((r) => r.data.data);

// ── Config ───────────────────────────────────────────────────────────────────
export const fetchConfigStatus = () =>
  apiClient.get('/config/status').then((r) => r.data.data);

export const toggleEmergency = () =>
  apiClient.patch('/config/emergency').then((r) => r.data.data);

export const saveSchedule = (dailySchedule: any[]) =>
  apiClient.put('/config/schedule', { dailySchedule }).then((r) => r.data.data);

export const saveBanner = (banner: string) =>
  apiClient.put('/config/banner', { banner }).then((r) => r.data.data);