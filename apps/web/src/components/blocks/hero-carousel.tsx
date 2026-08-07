'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HeroSlide {
  title: string;
  text: string;
  image: string;
  cta: string;
  ctaHref: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + totalSlides) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 900);
    },
    [isTransitioning, totalSlides]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 75) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <section
      className="relative mx-auto mt-4 mb-20 flex min-h-[500px] w-full max-w-[1200px] items-center justify-center overflow-hidden rounded-[70px] bg-[#FFF8E1] shadow-[0_5px_20px_rgba(0,0,0,0.08)] max-md:mt-8 max-md:mb-12 max-md:min-h-[420px] max-md:rounded-[30px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 flex items-center justify-around px-[43px] max-md:flex-col max-md:px-4',
            index === current
              ? 'pointer-events-auto z-[1] opacity-100'
              : 'pointer-events-none invisible opacity-0',
            'transition-[opacity] duration-[900ms] ease-[ease-in-out]'
          )}
        >
          <div className="max-w-[550px] max-md:w-[95%] max-md:max-w-none">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-[350px] w-full rounded-2xl object-cover shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.05)] max-md:h-[220px]"
            />
          </div>

          <div className="flex max-w-[500px] flex-col items-start max-md:items-center max-md:text-center">
            <h2 className="font-['Oswald'] text-4xl sm:text-5xl md:text-[4rem] font-bold uppercase leading-[1.1] tracking-wide text-[#e53e3e] max-md:text-2xl line-clamp-3">
              {slide.title}
            </h2>
            <p className="font-['Open_Sans'] text-lg sm:text-xl text-[#4a5568] max-md:text-sm line-clamp-2">
              {slide.text}
            </p>
            <a
              href={slide.ctaHref}
              className="mt-6 inline-block rounded-full border-2 border-[#e53e3e] bg-transparent px-8 py-3 font-['Oswald'] text-[1.3em] font-semibold uppercase tracking-wider text-[#e53e3e] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:bg-[#e53e3e] hover:text-white max-md:px-6 max-md:py-2 max-md:text-base"
            >
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      <button
        onClick={goPrev}
        className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#e53e3e] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#e53e3e] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
        aria-label="Siguiente"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-4 max-md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              'rounded-full transition-all duration-300',
              index === current
                ? 'h-3 w-3 scale-125 bg-[#e53e3e] shadow-[0_0_0_4px_rgba(229,62,62,0.2)] max-md:h-2.5 max-md:w-2.5'
                : 'h-3 w-3 bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(0,0,0,0.5)] max-md:h-2.5 max-md:w-2.5'
            )}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
