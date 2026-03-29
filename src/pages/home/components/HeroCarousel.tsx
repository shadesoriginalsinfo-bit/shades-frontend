import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import carouselImg from "@/assets/carouselImg.png"
import carouselImg2 from "@/assets/carouselImg2.png"

interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  bg: string;
  accentBg: string;
  textDark: boolean;
  img: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "New Festive Collection · 2026",
    title: "SHADES",
    subtitle: "Be Who You Are",
    ctaPrimary: { label: "Shop Diwan", href: "/shop" },
    ctaSecondary: { label: "New Now", href: "/new-collection" },
    bg: "bg-gradient-to-br from-[#F5EFE7] via-[#EDE0D0] to-[#E8D8C4]",
    accentBg: "from-[#C6A46C]/20 to-transparent",
    textDark: true,
    img: carouselImg
  },
  {
    id: 2,
    eyebrow: "Exclusive Summer Drops",
    title: "NEW ARRIVALS",
    subtitle: "Crafted For Every Moment",
    ctaPrimary: { label: "Explore Now", href: "/new-collection" },
    ctaSecondary: { label: "View Lookbook", href: "/shop" },
    bg: "bg-gradient-to-br from-[#2A1F14] via-[#3D2B1F] to-[#4A3525]",
    accentBg: "from-[#C6A46C]/30 to-transparent",
    textDark: false,
    img: carouselImg
  },
  {
    id: 3,
    eyebrow: "Premium Ethnic Wear",
    title: "ELEGANCE",
    subtitle: "Redefined In Every Thread",
    ctaPrimary: { label: "Shop Collection", href: "/shop" },
    ctaSecondary: { label: "About Us", href: "/about" },
    bg: "bg-gradient-to-br from-[#F0E6DA] via-[#E8DDD0] to-[#EDE3D8]",
    accentBg: "from-[#B8936A]/25 to-transparent",
    textDark: true,
    img: carouselImg2
  },
];

interface IndicatorProps {
  total: number;
  current: number;
  onSelect: (i: number) => void;
  dark: boolean;
}

const SlideIndicator = ({ total, current, onSelect, dark }: IndicatorProps) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Go to slide ${i + 1}`}
        className={`rounded-full transition-all duration-300 ${
          i === current
            ? "w-7 h-2 bg-[#C6A46C]"
            : `w-2 h-2 ${dark ? "bg-[#C6A46C]/40" : "bg-white/40"}`
        }`}
      />
    ))}
  </div>
);

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [current, goTo]
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section
      className={`relative w-full h-[420px] sm:h-[500px] md:h-[580px] ${slide.bg} overflow-hidden transition-colors duration-700`}
    >
      {/* Soft radial glow on right */}
      <div
        className={`absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_85%_at_80%_50%,${
          slide.textDark ? "rgba(212,175,122,0.18)" : "rgba(212,175,122,0.22)"
        }_0%,transparent_70%)]`}
      />

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-[0.025] bg-[repeating-linear-gradient(45deg,#C6A46C_0px,#C6A46C_1px,transparent_1px,transparent_12px)]" />

      {/* Decorative right-side silhouette block */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none overflow-hidden">
        <div
          className={`absolute right-0 top-0 bottom-0 w-full bg-gradient-to-l ${slide.accentBg}`}
        />
        {/* Decorative arch */}
        <div
          className={`absolute bottom-0 right-8 w-52 h-[85%] rounded-t-full border-2 ${
            slide.textDark ? "border-[#C6A46C]/15" : "border-[#C6A46C]/20"
          } hidden md:block`}
        />
        <div
          className={`absolute bottom-0 right-20 w-36 h-[70%] rounded-t-full ${
            slide.textDark ? "bg-[#C6A46C]/06" : "bg-[#C6A46C]/08"
          } hidden md:block`}
        />
        {/* Placeholder label for model image */}
        <div
          className={`absolute ${slide.id === 3 ? "bottom-0" : "bottom-8"} right-12 text-[10px] tracking-[0.25em] uppercase ${
            slide.textDark ? "text-[#C6A46C]/30" : "text-[#C6A46C]/50"
          } hidden md:block`}
        >
          <img src={slide.img} alt="" />
        </div>
      </div>

      {/* Main text content */}
      <div
        key={animKey}
        className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col justify-center"
        style={{ animation: "heroFadeUp 0.55s ease both" }}
      >
        {/* Eyebrow */}
        <p
          className={`text-[10px] tracking-[0.35em] uppercase font-medium mb-4 ${
            slide.textDark ? "text-[#C6A46C]" : "text-[#C6A46C]"
          }`}
          style={{ animationDelay: "0.05s", animation: "heroFadeUp 0.55s ease both" }}
        >
          {slide.eyebrow}
        </p>

        {/* Main title */}
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-serif tracking-wide leading-none ${
            slide.textDark ? "text-[#2A1810]" : "text-white"
          }`}
          style={{ animationDelay: "0.1s", animation: "heroFadeUp 0.6s ease both" }}
        >
          {slide.title}
        </h1>

        {/* Decorative divider */}
        <div
          className="flex items-center gap-3 my-5"
          style={{ animationDelay: "0.15s", animation: "heroFadeUp 0.6s ease both" }}
        >
          <div className="h-px w-14 bg-[#C6A46C]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
          <div className="h-px w-8 bg-[#C6A46C]/50" />
        </div>

        {/* Subtitle / tagline */}
        <p
          className={`text-2xl sm:text-3xl md:text-4xl font-light italic font-serif leading-snug ${
            slide.textDark ? "text-[#5C3D2A]" : "text-[#E8D0B0]"
          }`}
          style={{ animationDelay: "0.2s", animation: "heroFadeUp 0.65s ease both" }}
        >
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center gap-4 mt-8 mb-6 md:mb-0"
          style={{ animationDelay: "0.28s", animation: "heroFadeUp 0.65s ease both" }}
        >
          <Link
            to={slide.ctaPrimary.href}
            className="inline-flex items-center px-8 py-3.5 bg-[#C6A46C] text-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#B8936A] transition-all duration-200 shadow-[0_4px_20px_rgba(198,164,108,0.4)] rounded-sm"
          >
            {slide.ctaPrimary.label}
          </Link>
          <Link
            to={slide.ctaSecondary.href}
            className={`inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-200 rounded-sm border ${
              slide.textDark
                ? "border-[#2A1810] text-[#2A1810] hover:bg-[#2A1810] hover:text-white"
                : "border-white text-white hover:bg-white hover:text-[#2A1810]"
            }`}
          >
            {slide.ctaSecondary.label}
            <span className="text-base leading-none">→</span>
          </Link>
        </div>
      </div>

      {/* Prev Arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/80 hover:bg-[#C6A46C] hover:text-white text-[#C6A46C] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/80 hover:bg-[#C6A46C] hover:text-white text-[#C6A46C] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide number */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2">
        <span className="text-[#C6A46C] text-sm font-light font-serif">
          0{current + 1}
        </span>
        <span className="text-[#C6A46C]/30 text-xs">/</span>
        <span className="text-[#C6A46C]/50 text-xs">0{SLIDES.length}</span>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <SlideIndicator
          total={SLIDES.length}
          current={current}
          onSelect={goTo}
          dark={slide.textDark}
        />
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;