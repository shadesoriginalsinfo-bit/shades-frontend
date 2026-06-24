import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMediaBanners } from "@/hooks/useMedia";

const MediaCarousel = () => {
  const { data: slides = [], isLoading } = useMediaBanners();
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo, slides.length],
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo, slides.length],
  );

  // Reset index when slides change
  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[420px] sm:h-[500px] md:h-[580px] bg-[#F0EBE3] animate-pulse flex items-center justify-center">
        <Loader2 className="size-8 text-[#9A7A46]/50 animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative w-full h-[280px] sm:h-[580px] md:h-[580px] overflow-hidden bg-[#1a1a1a]">
      {/* Blurred backdrop — fills letterbox gaps with the same image */}
      <img
        src={slide.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70 pointer-events-none"
      />

      {/* Main image — cover on mobile (fills frame), contain on md+ (full image visible) */}
      <img
        key={animKey}
        src={slide.url}
        alt={slide.altText ?? "banner"}
        className="absolute inset-0 w-full h-full object-cover sm:object-contain object-center"
        style={{ animation: "carouselFade 0.6s ease both" }}
      />

      {/* Subtle gradient overlay — bottom only for nav visibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Prev Arrow */}
      {slides.length > 1 && (
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/80 hover:bg-[#9A7A46] hover:text-white text-[#9A7A46] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Next Arrow */}
      {slides.length > 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/80 hover:bg-[#9A7A46] hover:text-white text-[#9A7A46] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2">
          <span className="text-white/80 text-sm font-light font-serif">
            0{current + 1}
          </span>
          <span className="text-white/30 text-xs">/</span>
          <span className="text-white/50 text-xs">0{slides.length}</span>
        </div>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-7 h-2 bg-[#9A7A46]" : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes carouselFade {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default MediaCarousel;
