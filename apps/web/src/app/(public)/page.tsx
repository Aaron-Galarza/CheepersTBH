import { HeroCarousel } from '@/components/blocks/hero-carousel';
import { AboutSection } from '@/components/blocks/about-section';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <AboutSection />
    </div>
  );
}
