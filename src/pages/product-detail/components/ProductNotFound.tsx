import { Link } from "react-router-dom";
import { PackageSearch, ArrowLeft } from "lucide-react";

interface ProductNotFoundProps {
  isError?: boolean;
}

const ProductNotFound = ({ isError = false }: ProductNotFoundProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    {/* Icon */}
    <div className="relative mb-8">
      <div className="w-20 h-20 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center">
        <PackageSearch size={32} className="text-[#9A7A46]" />
      </div>
      {/* Ornament ring */}
      <div className="absolute -inset-2 rounded-full border border-[#9A7A46]/20" />
      <div className="absolute -inset-4 rounded-full border border-[#9A7A46]/10" />
    </div>

    {/* Text */}
    <p className="text-[10px] tracking-[0.35em] uppercase text-[#9A7A46] font-medium mb-3">
      {isError ? "Something went wrong" : "404 · Not Found"}
    </p>
    <h2 className="text-3xl font-bold font-serif text-[#2A1810] mb-2">
      {isError ? "Failed to load product" : "Product not found"}
    </h2>

    {/* Ornamental divider */}
    <div className="flex items-center gap-2 justify-center my-4">
      <div className="h-px w-10 bg-[#9A7A46]" />
      <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
      <div className="h-px w-10 bg-[#9A7A46]" />
    </div>

    <p className="text-sm text-gray-500 tracking-wide max-w-sm mb-8 leading-relaxed">
      {isError
        ? "We couldn't load this product. Please check your connection and try again."
        : "This product may have been removed or the link might be incorrect."}
    </p>

    <div className="flex flex-wrap items-center gap-4 justify-center">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-8 py-3 bg-[#9A7A46] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#B8936A] transition-colors rounded-sm"
      >
        Browse Shop
      </Link>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3 border border-[#E8DDD0] text-gray-600 text-xs tracking-[0.2em] uppercase font-medium hover:border-[#9A7A46] hover:text-[#9A7A46] transition-colors rounded-sm"
      >
        <ArrowLeft size={13} />
        Back to Home
      </Link>
    </div>
  </div>
);

export default ProductNotFound;
