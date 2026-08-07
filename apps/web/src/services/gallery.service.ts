import apiClient from './api';
import { GalleryImage } from '@/types';

export const galleryService = {
  getPublic: async (): Promise<GalleryImage[]> => {
    const res = await apiClient.get('/gallery');
    return res.data.data || [];
  },
  getAll: async (): Promise<GalleryImage[]> => {
    const res = await apiClient.get('/gallery/admin/all');
    return res.data.data || [];
  },
  upload: async (file: File, title: string, order = 0): Promise<GalleryImage> => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', title);
    fd.append('order', String(order));
    const res = await apiClient.post('/gallery/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data;
  },
  update: async (id: string, data: Partial<GalleryImage>): Promise<GalleryImage> => {
    const res = await apiClient.put(`/gallery/admin/${id}`, data);
    return res.data.data;
  },
  toggleActive: async (id: string): Promise<GalleryImage> => {
    const res = await apiClient.patch(`/gallery/admin/${id}/toggle`);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/gallery/admin/${id}`);
  },
};
