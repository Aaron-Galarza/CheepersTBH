'use client';

import { HeroCarousel } from '@/components/blocks/hero-carousel';
import { useBanners } from '../hooks/useBanners';

export function HeroSection() {
  const { slides, loading } = useBanners();

  if (loading) {
    return (
      <div className="mx-auto mt-4 mb-20 max-w-[1200px] animate-pulse">
        <div className="h-[420px] w-full rounded-[30px] bg-gray-200 md:h-[500px] md:rounded-[70px]" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return <HeroCarousel slides={slides} />;
}
