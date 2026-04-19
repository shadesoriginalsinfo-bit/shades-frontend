import { Eye, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { type IProduct } from "@/types/product";

interface ProductCardProps {
  product: IProduct;
}

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const ProductCard = ({ product }: ProductCardProps) => {
  const sortedImages = [...product.images].sort(
    (a, b) => a.position - b.position,
  );
  const primaryImage = sortedImages[0];
  const hoverImage = sortedImages[1];

  const finalPrice = product.discountPrice ?? product.marketPrice;
  const discount =
    product.discountPrice && product.marketPrice > product.discountPrice
      ? Math.round(
          ((product.marketPrice - product.discountPrice) /
            product.marketPrice) *
            100,
        )
      : null;

  const isOutOfStock = product.stock === 0;
  const category = product.productCategories[0]?.category;

  const navigate = useNavigate();

  return (
    <article className="group relative bg-white border border-[#E8DDD0] hover:border-[#9A7A46]/60 hover:shadow-[0_8px_32px_rgba(198,164,108,0.14)] transition-all duration-300 rounded-sm overflow-hidden flex flex-col">
      {/* ─── Image block ─── */}
      <div className="relative overflow-hidden aspect-3/4 bg-[#F5EFE7] shrink-0">
        {primaryImage ? (
          <>
            <Link to={`/product/${product.id}`} className="absolute inset-0">
              <img
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                }`}
              />
            </Link>

            {hoverImage && (
              <Link to={`/product/${product.id}`} className="absolute inset-0">
                <img
                  src={hoverImage.url}
                  alt={hoverImage.altText ?? product.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-[1.03]"
                />
              </Link>
            )}
          </>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ShoppingBag size={44} className="text-[#9A7A46]/25" />
          </Link>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-[#9A7A46] text-white text-[10px] font-semibold tracking-wider px-2 py-1 rounded-sm shadow-sm">
              -{discount}%
            </span>
          )}
          {!isOutOfStock && product.stock <= 5 && (
            <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-medium tracking-wider px-2 py-1 rounded-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          {/* <button
            aria-label="Add to wishlist"
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#9A7A46] hover:text-white transition-all shadow-md"
          >
            <Heart size={15} />
          </button> */}
          <Link
            to={`/product/${product.id}`}
            aria-label="Quick view"
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#9A7A46] hover:text-white transition-all shadow-md"
          >
            <Eye size={15} />
          </Link>
        </div>

        {/* Add to cart overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            disabled={isOutOfStock}
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full py-3 bg-[#1a1a1a] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Out of Stock" : "View"}
          </button>
        </div>
      </div>

      {/* ─── Product info ─── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        {category && (
          <Link
            to={`/shop?category=${category.slug}`}
            className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium mb-1.5 hover:text-[#B8936A] transition-colors"
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 font-serif leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Short description if available */}
        {/* {product.shortDesc && (
          <p className="text-xs text-gray-400 line-clamp-1 mt-1 tracking-wide">
            {product.shortDesc}
          </p>
        )} */}

        {/* Price row */}
        <div className="flex items-baseline gap-1 md:gap-2 mt-3">
          <span className="text-[15px] md:text-base font-semibold text-[#3D2B1F] tracking-tight">
            {formatINR(finalPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-[11px] md:text-sm text-gray-400 line-through font-normal">
              {formatINR(product.marketPrice)}
            </span>
          )}
          {discount && (
            <span className="text-[11px] md:text-xs text-emerald-600 font-medium ml-auto">
              Save {formatINR(product.marketPrice - finalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
