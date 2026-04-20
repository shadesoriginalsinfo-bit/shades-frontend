import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  // Heart,
  // ShoppingBag,
  // Share2,
  ChevronDown,
  ChevronUp,
  Truck,
  RefreshCw,
  Shield,
  BadgeCheck,
  Minus,
  Plus,
} from "lucide-react";
import { type IProduct } from "@/types/product";
import { useAuthUser } from "@/hooks/useAuth";

interface ProductInfoProps {
  product: IProduct;
  selectedVariantIdx: number;
  onVariantChange: (idx: number) => void;
}

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

/* ── Collapsible accordion row ───────────────────────────────────────── */
interface AccordionProps {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Accordion = ({
  label,
  defaultOpen = false,
  children,
}: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8DDD0] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 group-hover:text-[#9A7A46] transition-colors">
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-[#9A7A46] shrink-0" />
        ) : (
          <ChevronDown
            size={14}
            className="text-gray-400 group-hover:text-[#9A7A46] transition-colors shrink-0"
          />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed tracking-wide">
          {children}
        </div>
      )}
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────────────── */
const ProductInfo = ({ product, selectedVariantIdx, onVariantChange }: ProductInfoProps) => {
  const [qty, setQty] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: user, isLoading: authLoading } = useAuthUser();

  const selectedVariant = product.variants[selectedVariantIdx];

  const handleVariantChange = (idx: number) => {
    onVariantChange(idx);
    setSelectedSizeId(null);
    setQty(1);
  };

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSizeId(sizeId);
    setQty(1);
  };

  const selectedSize = selectedVariant?.sizes.find((s) => s.id === selectedSizeId) ?? null;
  const variantStock = selectedVariant?.sizes.reduce((s, sz) => s + sz.stock, 0) ?? 0;
  const maxQty = selectedSize ? selectedSize.stock : variantStock;

  const handleBuyNow = () => {
    const checkoutState = { product, quantity: qty, variantId: selectedVariant?.id, sizeId: selectedSizeId };
    if (user) {
      navigate("/checkout", { state: checkoutState });
    } else {
      navigate("/login", { state: { from: "/checkout", checkoutState } });
    }
  };

  const finalPrice = product.discountPrice ?? product.marketPrice;
  const discount =
    product.discountPrice && product.marketPrice > product.discountPrice
      ? Math.round(
          ((product.marketPrice - product.discountPrice) /
            product.marketPrice) *
            100,
        )
      : null;

  const totalStock = variantStock;
  const isOutOfStock = totalStock === 0;
  const isLowStock = !isOutOfStock && totalStock <= 10;
  const category = product.productCategories[0]?.category;
  const hasSizes = (selectedVariant?.sizes.length ?? 0) > 0;
  const sizeRequired = hasSizes && !selectedSizeId;

  // const handleShare = async () => {
  //   try {
  //     await navigator.share({ title: product.title, url: window.location.href });
  //   } catch {
  //     navigator.clipboard.writeText(window.location.href);
  //   }
  // };

  return (
    <div className="space-y-5">
      {/* ── Breadcrumb + category ── */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <Link
          to="/"
          className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
        >
          Home
        </Link>
        <span className="text-gray-300 text-xs">·</span>
        <Link
          to="/shop"
          className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
        >
          Shop
        </Link>
        {category && (
          <>
            <span className="text-gray-300 text-xs">·</span>
            <Link
              to={`/shop?category=${category.slug}`}
              className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium hover:text-[#B8936A] transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
      </div>

      {/* ── Title ── */}
      <h1 className="hidden md:block text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-[#2A1810] leading-tight tracking-tight">
        {product.title}
      </h1>

      {/* ── Ornamental divider ── */}
      <div className="flex items-center gap-2">
        <div className="h-px w-10 bg-[#9A7A46]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
        <div className="h-px w-6 bg-[#9A7A46]/50" />
      </div>

      {/* ── Color variant selector ── */}
      {product.variants.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500 font-medium">
              Color
            </span>
            <span className="text-[10px] text-gray-700 font-medium capitalize">
              — {selectedVariant?.color}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant, idx) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(idx)}
                title={variant.color}
                aria-label={`Select ${variant.color}`}
                className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  idx === selectedVariantIdx
                    ? "border-[#9A7A46] shadow-[0_0_0_3px_rgba(154,122,70,0.2)]"
                    : "border-[#E8DDD0] hover:border-[#9A7A46]/60"
                }`}
                style={{ backgroundColor: variant.colorCode ?? "#e5e7eb" }}
              >
                {!variant.colorCode && (
                  <span className="text-[8px] font-bold text-gray-600 leading-none">
                    {variant.color.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Price block ── */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[#2A1810] tracking-tight">
          {formatINR(finalPrice)}
        </span>
        {product.discountPrice && (
          <>
            <span className="text-lg text-gray-400 line-through font-normal mb-0.5">
              {formatINR(product.marketPrice)}
            </span>
            <span className="mb-1 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold tracking-wider rounded-sm">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Savings callout */}
      {product.discountPrice && (
        <p className="text-xs text-emerald-600 font-medium -mt-1 tracking-wide">
          You save{" "}
          <span className="font-bold">
            {formatINR(product.marketPrice - finalPrice)}
          </span>{" "}
          on this order
        </p>
      )}

      {/* GST note */}
      {product.gstPercent > 0 && (
        <p className="text-[11px] text-gray-400 tracking-wide -mt-2">
          Inclusive of {product.gstPercent}% GST
        </p>
      )}

      {/* ── Stock badge ── */}
      <div>
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-[11px] tracking-wider font-medium rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] tracking-wider font-medium rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Only {totalStock} left — order soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] tracking-wider font-medium rounded-sm">
            <BadgeCheck size={12} />
            In Stock ({totalStock} available)
          </span>
        )}
      </div>

      {/* ── Short description ── */}
      {product.shortDesc && (
        <p className="text-sm text-gray-600 leading-relaxed tracking-wide border-l-2 border-[#9A7A46]/40 pl-4">
          {product.shortDesc}
        </p>
      )}

      {/* ── Size selector ── */}
      {!isOutOfStock && hasSizes && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500 font-medium">
              Size
            </span>
            {selectedSize ? (
              <span className="text-[10px] text-gray-700 font-medium">
                — {selectedSize.size}
              </span>
            ) : (
              <span className="text-[10px] text-amber-600 font-medium">
                — Please select a size
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedVariant.sizes.map((sz) => {
              const outOfStock = sz.stock === 0;
              const isSelected = sz.id === selectedSizeId;
              return (
                <button
                  key={sz.id}
                  onClick={() => handleSizeSelect(sz.id)}
                  disabled={outOfStock}
                  className={`relative px-4 py-2 text-xs font-medium tracking-wide border rounded-sm transition-all duration-200 ${
                    isSelected
                      ? "border-[#9A7A46] bg-[#9A7A46] text-white"
                      : outOfStock
                        ? "border-[#E8DDD0] text-gray-300 cursor-not-allowed line-through"
                        : "border-[#E8DDD0] text-gray-700 hover:border-[#9A7A46] hover:text-[#9A7A46]"
                  }`}
                >
                  {sz.size}
                  {!outOfStock && sz.stock <= 5 && (
                    <span
                      title={`Only ${sz.stock} left`}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {selectedSize && (
            <p className="text-[11px] tracking-wide">
              {selectedSize.stock <= 5 ? (
                <span className="text-amber-600 font-medium">
                  Only {selectedSize.stock} left in this size
                </span>
              ) : (
                <span className="text-gray-400">{selectedSize.stock} available in this size</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* ── Quantity selector ── */}
      {!isOutOfStock && !sizeRequired && (
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500 font-medium">
            Qty
          </span>
          <div className="flex items-center border border-[#E8DDD0] rounded-sm overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#9A7A46] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#E8DDD0]"
            >
              <Minus size={13} />
            </button>
            <span className="w-10 text-center text-sm font-medium text-gray-800">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              aria-label="Increase quantity"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#9A7A46] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-[#E8DDD0]"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex items-stretch gap-3">
        {/* Add to cart */}
        {/* <button
          disabled={isOutOfStock}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#1a1a1a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          <ShoppingBag size={15} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button> */}

        {/* Wishlist */}
        {/* <button
          onClick={() => setWishlisted((w) => !w)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-12 flex items-center justify-center border rounded-sm transition-all duration-200 ${
            wishlisted
              ? "border-red-300 bg-red-50 text-red-500 shadow-inner"
              : "border-[#E8DDD0] text-gray-400 hover:border-[#9A7A46] hover:text-[#9A7A46] hover:bg-[#F5EFE7]"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button> */}

        {/* Share */}
        {/* <button
          onClick={handleShare}
          aria-label="Share product"
          className="w-12 flex items-center justify-center border border-[#E8DDD0] text-gray-400 hover:border-[#9A7A46] hover:text-[#9A7A46] hover:bg-[#F5EFE7] rounded-sm transition-all duration-200"
        >
          <Share2 size={15} />
        </button> */}
      </div>

      {/* ── Buy now ── */}
      {!isOutOfStock && (
        <button
          onClick={handleBuyNow}
          disabled={authLoading || sizeRequired}
          className="w-full py-3.5 border border-[#9A7A46] text-[#9A7A46] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] hover:text-white transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {authLoading ? "Please wait…" : sizeRequired ? "Select a size to continue" : "Buy Now"}
        </button>
      )}

      {/* ── Trust icons row ── */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#E8DDD0]">
        {[
          { Icon: Truck, label: "Free Delivery", sub: "Above ₹999" },
          { Icon: RefreshCw, label: "Easy Exchange", sub: "Hassle free" },
          { Icon: Shield, label: "Secure Pay", sub: "100% safe" },
        ].map(({ Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-1.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center">
              <Icon size={14} className="text-[#9A7A46]" />
            </div>
            <span className="text-[10px] font-medium text-gray-700 tracking-wide leading-tight">
              {label}
            </span>
            <span className="text-[9px] text-gray-400 tracking-wide">
              {sub}
            </span>
          </div>
        ))}
      </div>

      {/* ── Meta info ── */}
      <div className="space-y-2 text-xs tracking-wide">
        {category && (
          <div className="flex gap-3">
            <span className="text-gray-400 w-20 shrink-0">Category</span>
            <Link
              to={`/shop?category=${category.slug}`}
              className="text-[#9A7A46] hover:text-[#B8936A] transition-colors font-medium"
            >
              {category.name}
            </Link>
          </div>
        )}
        <div className="flex gap-3">
          <span className="text-gray-400 w-20 shrink-0">Product ID</span>
          <span className="text-gray-500 font-mono text-[11px]">
            {product.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-400 w-20 shrink-0">Updated</span>
          <span className="text-gray-500">
            {new Date(product.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ── Accordions: description + care + shipping ── */}
      <div className="border-t border-[#E8DDD0] mt-2">
        {product.description && (
          <Accordion label="Product Description" defaultOpen>
            <ul className="space-y-2 text-gray-600">
              {product.description
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#9A7A46] mt-0.5 shrink-0">·</span>
                    {line}
                  </li>
                ))}
            </ul>
          </Accordion>
        )}

        {product.careInstruction && (
          <Accordion label="Care Instructions">
            <ul className="space-y-2 text-gray-600">
              {product.careInstruction
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#9A7A46] mt-0.5 shrink-0">·</span>
                    {line}
                  </li>
                ))}
            </ul>
          </Accordion>
        )}

        <Accordion label="Shipping Policy">
          <ul className="space-y-2 text-gray-600">
            {[
              "Orders are processed within 24-48 hours.",
              "Delivery time: 3–5 working days across India. depending on your pin code.",
              "Free shipping on orders above ₹999.",
              "₹70 shipping charge for orders below ₹999.",
              "You will receive a tracking link after dispatch.",
            ].map((info) => (
              <li key={info} className="flex items-start gap-2">
                <span className="text-[#9A7A46] mt-0.5 shrink-0">·</span>
                {info}
              </li>
            ))}
          </ul>
        </Accordion>

        <Accordion label="Exchange Policy">
          <ul className="space-y-2 text-gray-600">
            {[
              "We do not offer refunds under any circumstances.",
              "Exchange is available only for size issues or damaged products (Opening video is mandatory for damaged product claims.)",
              "Exchange request must be raised within 3 days of delivery.",
              "Product must be unused, unwashed, with tags intact.",
              "Reverse pickup available (depending on location).",
              "Only one-time exchange is allowed per order.",
            ].map((info) => (
              <li key={info} className="flex items-start gap-2">
                <span className="text-[#9A7A46] mt-0.5 shrink-0">·</span>
                {info}
              </li>
            ))}
          </ul>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductInfo;
