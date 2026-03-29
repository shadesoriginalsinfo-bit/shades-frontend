import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ShoppingBag } from "lucide-react";
import { type IProductImage } from "@/types/product";

interface ProductImageGalleryProps {
  images: IProductImage[];
  title: string;
}

/* ── Thumbnail skeleton ─────────────────────────────────────────────── */
export const GallerySkeleton = () => (
  <div className="flex gap-4">
    {/* Thumb strip */}
    <div className="hidden sm:flex flex-col gap-2.5 w-16 shrink-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-16 h-16 rounded-sm bg-gradient-to-b from-[#F0E8DC] to-[#EDE0D0] animate-pulse"
        />
      ))}
    </div>
    {/* Main image */}
    <div className="flex-1 aspect-[4/5] rounded-sm bg-gradient-to-b from-[#F0E8DC] to-[#EDE0D0] animate-pulse" />
  </div>
);

/* ── Main component ─────────────────────────────────────────────────── */
const ProductImageGallery = ({ images, title }: ProductImageGalleryProps) => {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const prev = useCallback(
    () => setActiveIdx((i) => (i - 1 + sorted.length) % sorted.length),
    [sorted.length]
  );
  const next = useCallback(
    () => setActiveIdx((i) => (i + 1) % sorted.length),
    [sorted.length]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const active = sorted[activeIdx];

  if (!sorted.length) {
    return (
      <div className="aspect-[4/5] rounded-sm bg-[#F5EFE7] flex items-center justify-center border border-[#E8DDD0]">
        <ShoppingBag size={48} className="text-[#C6A46C]/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 md:gap-4">
      {/* ── Thumbnail strip ── */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible sm:w-[72px] shrink-0 pb-1 sm:pb-0">
        {sorted.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIdx(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-sm overflow-hidden border-2 transition-all duration-200 ${
              i === activeIdx
                ? "border-[#C6A46C] shadow-[0_0_0_2px_rgba(198,164,108,0.25)]"
                : "border-[#E8DDD0] hover:border-[#C6A46C]/60"
            }`}
          >
            <img
              src={img.url}
              alt={img.altText ?? `${title} image ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {i === activeIdx && (
              <div className="absolute inset-0 bg-[#C6A46C]/08 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* ── Main image ── */}
      <div className="relative flex-1 group">
        {/* Zoom container */}
        <div
          className={`relative overflow-hidden rounded-sm aspect-[4/5] bg-[#F5EFE7] border border-[#E8DDD0] cursor-crosshair select-none`}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={active.url}
            alt={active.altText ?? title}
            className={`w-full h-full object-cover transition-transform duration-100 ${
              zoomed ? "scale-[1.85]" : "scale-100"
            }`}
            style={
              zoomed
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            draggable={false}
          />

          {/* Zoom hint */}
          {!zoomed && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-[#E8DDD0] px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <ZoomIn size={12} className="text-[#C6A46C]" />
              <span className="text-[10px] tracking-[0.15em] text-gray-500">Hover to zoom</span>
            </div>
          )}

          {/* Image counter badge */}
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] tracking-widest px-2 py-1 rounded-sm pointer-events-none">
            {activeIdx + 1} / {sorted.length}
          </div>
        </div>

        {/* Prev / Next arrows — only show when multiple images */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-[#C6A46C] hover:text-white text-[#C6A46C] border border-[#E8DDD0] hover:border-[#C6A46C] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-[#C6A46C] hover:text-white text-[#C6A46C] border border-[#E8DDD0] hover:border-[#C6A46C] rounded-full shadow-md transition-all duration-200 backdrop-blur-sm z-10"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;