import { useState, useEffect } from 'react';
import { menuService } from '@/services/menu.service';
import { Banner } from '@/types';

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await menuService.getBanners();
        setBanners(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(null); // Los banners no son críticos
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return {
    banners,
    loading,
    error,
  };
}