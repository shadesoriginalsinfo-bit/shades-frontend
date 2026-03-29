import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface ShopBannerProps {
  searchQuery: string;
  categoryName: string | undefined;
  totalCount: number | undefined;
}

const ShopBanner = ({ searchQuery, categoryName, totalCount }: ShopBannerProps) => {
  const heading = categoryName
    ? categoryName
    : searchQuery
    ? `"${searchQuery}"`
    : "All Products";

  const sub = categoryName
    ? "Explore the full collection"
    : searchQuery
    ? "Search results"
    : "Discover our curated ethnic wear";

  return (
    <section className="relative bg-gradient-to-br from-[#F5EFE7] via-[#EDE0D0] to-[#E8D8C4] overflow-hidden">
      {/* Diagonal stripe texture — matches carousel */}
      <div className="absolute inset-0 opacity-[0.025] bg-[repeating-linear-gradient(45deg,#C6A46C_0px,#C6A46C_1px,transparent_1px,transparent_12px)]" />

      {/* Radial warm glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(212,175,122,0.18)_0%,transparent_70%)]" />

      {/* Decorative arch — right side, mirrors carousel */}
      <div className="absolute right-10 bottom-0 w-44 h-[90%] rounded-t-full border border-[#C6A46C]/15 hidden md:block" />
      <div className="absolute right-24 bottom-0 w-28 h-[70%] rounded-t-full bg-[#C6A46C]/[0.04] hidden md:block" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-4" aria-label="Breadcrumb">
          <Link
            to="/"
            className="text-[10px] tracking-[0.25em] uppercase text-[#C6A46C]/60 hover:text-[#C6A46C] transition-colors"
          >
            Home
          </Link>
          <span className="text-[#C6A46C]/30 text-xs">·</span>
          <Link
            to="/shop"
            className="text-[10px] tracking-[0.25em] uppercase text-[#C6A46C]/60 hover:text-[#C6A46C] transition-colors"
          >
            Shop
          </Link>
          {categoryName && (
            <>
              <span className="text-[#C6A46C]/30 text-xs">·</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A46C]">
                {categoryName}
              </span>
            </>
          )}
        </nav>

        {/* Search context pill */}
        {searchQuery && (
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 bg-white/60 border border-[#C6A46C]/30 rounded-full backdrop-blur-sm">
            <Search size={11} className="text-[#C6A46C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
              Searching for: {searchQuery}
            </span>
          </div>
        )}

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-wide text-[#2A1810] leading-none mb-3">
          {heading}
        </h1>

        {/* Ornamental divider — identical to carousel */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px w-14 bg-[#C6A46C]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
          <div className="h-px w-8 bg-[#C6A46C]/50" />
        </div>

        {/* Subtitle + count */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-[#5C3D2A] font-light italic font-serif">{sub}</p>
          {totalCount !== undefined && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] bg-[#C6A46C]/10 px-2.5 py-1 rounded-sm border border-[#C6A46C]/20">
              {totalCount} {totalCount === 1 ? "item" : "items"} found
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopBanner;