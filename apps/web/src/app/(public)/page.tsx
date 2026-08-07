import { HeroSection } from '@/features/home/components/HeroSection';
import { AboutSection } from '@/components/blocks/about-section';
import { CTASection } from '@/components/blocks/cta-section';
import { StoreStatus } from '@/features/menu/components/StoreClosed';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 pt-2 pb-1">
        <StoreStatus />
      </div>
      <HeroSection />
      <AboutSection />
      <CTASection />
    </div>
  );
}
