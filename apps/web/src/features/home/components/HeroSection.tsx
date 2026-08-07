'use client';

import { HeroCarousel } from '@/components/blocks/hero-carousel';
import { useBanners } from '../hooks/useBanners';

export function HeroSection() {
  const { slides, loading } = useBanners();

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[#757575]">Cargando...</p>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return <HeroCarousel slides={slides} />;
}
