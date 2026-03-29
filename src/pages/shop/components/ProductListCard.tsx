import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { type IProduct } from "@/types/product";

interface ProductListCardProps {
  product: IProduct;
}

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const ProductListCard = ({ product }: ProductListCardProps) => {
  const sortedImages = [...product.images].sort((a, b) => a.position - b.position);
  const primaryImage = sortedImages[0];

  const finalPrice = product.discountPrice ?? product.marketPrice;
  const discount =
    product.discountPrice && product.marketPrice > product.discountPrice
      ? Math.round(
          ((product.marketPrice - product.discountPrice) / product.marketPrice) * 100
        )
      : null;

  const isOutOfStock = product.stock === 0;
  const category = product.productCategories[0]?.category;

  return (
    <Link to={`/product/${product.id}`} className="group flex gap-4 md:gap-6 bg-white border border-[#E8DDD0] hover:border-[#C6A46C]/60 hover:shadow-[0_6px_28px_rgba(198,164,108,0.12)] transition-all duration-300 rounded-sm overflow-hidden p-3 md:p-4">
      {/* Image */}
      <div className="relative w-28 md:w-36 aspect-[3/4] rounded-sm overflow-hidden bg-[#F5EFE7] shrink-0">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={28} className="text-[#C6A46C]/25" />
          </div>
        )}

        {discount && (
          <span className="absolute top-2 left-2 bg-[#C6A46C] text-white text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Category */}
        {category && (
          <Link
            to={`/shop?category=${category.slug}`}
            className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium mb-1 hover:text-[#B8936A] transition-colors"
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm md:text-base font-serif font-medium text-gray-800 leading-snug hover:text-[#C6A46C] transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Short desc */}
        {product.shortDesc && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed hidden sm:block tracking-wide">
            {product.shortDesc}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base md:text-lg font-semibold text-[#3D2B1F]">
            {formatINR(finalPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatINR(product.marketPrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs text-emerald-600 font-medium">
              {discount}% off
            </span>
          )}
        </div>

        {/* Stock */}
        {!isOutOfStock && product.stock <= 5 && (
          <p className="text-[10px] text-red-500 tracking-wide mt-1">
            Only {product.stock} left in stock
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3">
          <button
            disabled={isOutOfStock}
            className="px-5 py-2 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            aria-label="Add to wishlist"
            className="w-8 h-8 flex items-center justify-center border border-[#E8DDD0] text-gray-400 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-all rounded-sm"
          >
            <Heart size={14} />
          </button>
          <Link
            to={`/product/${product.id}`}
            aria-label="View product"
            className="w-8 h-8 flex items-center justify-center border border-[#E8DDD0] text-gray-400 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-all rounded-sm"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductListCard;