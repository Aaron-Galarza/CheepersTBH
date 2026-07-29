'use client';

import { HeroCarousel } from '@/components/blocks/hero-carousel';
import { useBanners } from '../hooks/useBanners';

export function HeroSection() {
  const { loading } = useBanners();

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[#718096]">Cargando...</p>
      </div>
    );
  }

  return <HeroCarousel />;
}
