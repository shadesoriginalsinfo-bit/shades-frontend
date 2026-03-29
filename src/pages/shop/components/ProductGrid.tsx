import { PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { type IProduct } from "@/types/product";
import { type ViewMode } from "./ShopToolbar";
import ProductCard from "@/pages/home/components/ProductCard";
import ProductCardSkeleton from "@/pages/home/components/ProductCardSkeleton";
import ProductListCard from "./ProductListCard";
import ProductListCardSkeleton from "./ProductListCardSkeleton";

interface ProductGridProps {
  products: IProduct[];
  isLoading: boolean;
  isError: boolean;
  view: ViewMode;
  limit: number;
}

const ProductGrid = ({
  products,
  isLoading,
  isError,
  view,
  limit,
}: ProductGridProps) => {
  /* ── Error state ── */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <PackageSearch size={22} className="text-red-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 tracking-wide">
          Failed to load products
        </p>
        <p className="text-xs text-gray-400 mt-1 tracking-wide">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  /* ── Empty state ── */
  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center mb-5">
          <PackageSearch size={22} className="text-[#C6A46C]" />
        </div>
        <p className="text-base font-serif font-medium text-gray-700 tracking-wide mb-1">
          No products found
        </p>
        <p className="text-xs text-gray-400 tracking-wide mb-6">
          Try adjusting your filters or search query.
        </p>
        <Link
          to="/shop"
          className="px-7 py-2.5 border border-[#C6A46C] text-[#C6A46C] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] hover:text-white transition-all rounded-sm"
        >
          Clear All Filters
        </Link>
      </div>
    );
  }

  /* ── Grid view ── */
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="flex flex-col gap-3">
      {isLoading
        ? Array.from({ length: limit }).map((_, i) => (
            <ProductListCardSkeleton key={i} />
          ))
        : products.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
    </div>
  );
};

export default ProductGrid;