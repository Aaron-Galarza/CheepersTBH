'use client';

import { useState, useEffect } from 'react';
import { bannersService } from '@/services/banners.service';
import { Banner } from '@/types';
import { HERO_SLIDES } from '@/utils/constants';

interface UseBannersReturn {
  banners: Banner[];
  loading: boolean;
  heroSlides: typeof HERO_SLIDES;
}

export function useBanners(): UseBannersReturn {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bannersService
      .getActive()
      .then((data) => setBanners(data))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  return {
    banners,
    loading,
    heroSlides: HERO_SLIDES,
  };
}
