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
}

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

/* ── Collapsible accordion row ───────────────────────────────────────── */
interface AccordionProps {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Accordion = ({ label, defaultOpen = false, children }: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8DDD0] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 group-hover:text-[#C6A46C] transition-colors">
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-[#C6A46C] shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-gray-400 group-hover:text-[#C6A46C] transition-colors shrink-0" />
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
const ProductInfo = ({ product }: ProductInfoProps) => {
  const [qty, setQty] = useState(1);
  // const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();
  const { data: user, isLoading: authLoading } = useAuthUser();

  const handleBuyNow = () => {
    const checkoutState = { product, quantity: qty };
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
          ((product.marketPrice - product.discountPrice) / product.marketPrice) * 100
        )
      : null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;
  const category = product.productCategories[0]?.category;

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
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          to="/"
          className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#C6A46C] transition-colors"
        >
          Home
        </Link>
        <span className="text-gray-300 text-xs">·</span>
        <Link
          to="/shop"
          className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#C6A46C] transition-colors"
        >
          Shop
        </Link>
        {category && (
          <>
            <span className="text-gray-300 text-xs">·</span>
            <Link
              to={`/shop?category=${category.slug}`}
              className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium hover:text-[#B8936A] transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
      </div>

      {/* ── Title ── */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-[#2A1810] leading-tight tracking-tight">
        {product.title}
      </h1>

      {/* ── Ornamental divider ── */}
      <div className="flex items-center gap-2">
        <div className="h-px w-10 bg-[#C6A46C]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
        <div className="h-px w-6 bg-[#C6A46C]/50" />
      </div>

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
            Only {product.stock} left — order soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] tracking-wider font-medium rounded-sm">
            <BadgeCheck size={12} />
            In Stock ({product.stock} available)
          </span>
        )}
      </div>

      {/* ── Short description ── */}
      {product.shortDesc && (
        <p className="text-sm text-gray-600 leading-relaxed tracking-wide border-l-2 border-[#C6A46C]/40 pl-4">
          {product.shortDesc}
        </p>
      )}

      {/* ── Quantity selector ── */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500 font-medium">
            Qty
          </span>
          <div className="flex items-center border border-[#E8DDD0] rounded-sm overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#C6A46C] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#E8DDD0]"
            >
              <Minus size={13} />
            </button>
            <span className="w-10 text-center text-sm font-medium text-gray-800">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={qty >= product.stock}
              aria-label="Increase quantity"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#C6A46C] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-[#E8DDD0]"
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
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#1a1a1a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
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
              : "border-[#E8DDD0] text-gray-400 hover:border-[#C6A46C] hover:text-[#C6A46C] hover:bg-[#F5EFE7]"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button> */}

        {/* Share */}
        {/* <button
          onClick={handleShare}
          aria-label="Share product"
          className="w-12 flex items-center justify-center border border-[#E8DDD0] text-gray-400 hover:border-[#C6A46C] hover:text-[#C6A46C] hover:bg-[#F5EFE7] rounded-sm transition-all duration-200"
        >
          <Share2 size={15} />
        </button> */}
      </div>

      {/* ── Buy now ── */}
      {!isOutOfStock && (
        <button
          onClick={handleBuyNow}
          disabled={authLoading}
          className="w-full py-3.5 border border-[#C6A46C] text-[#C6A46C] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] hover:text-white transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {authLoading ? "Please wait…" : "Buy Now"}
        </button>
      )}

      {/* ── Trust icons row ── */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#E8DDD0]">
        {[
          { Icon: Truck,     label: "Free Delivery", sub: "Above ₹999" },
          { Icon: RefreshCw, label: "7-Day Return",  sub: "Hassle free" },
          { Icon: Shield,    label: "Secure Pay",    sub: "100% safe" },
        ].map(({ Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center">
              <Icon size={14} className="text-[#C6A46C]" />
            </div>
            <span className="text-[10px] font-medium text-gray-700 tracking-wide leading-tight">
              {label}
            </span>
            <span className="text-[9px] text-gray-400 tracking-wide">{sub}</span>
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
              className="text-[#C6A46C] hover:text-[#B8936A] transition-colors font-medium"
            >
              {category.name}
            </Link>
          </div>
        )}
        <div className="flex gap-3">
          <span className="text-gray-400 w-20 shrink-0">Product ID</span>
          <span className="text-gray-500 font-mono text-[11px]">{product.id.slice(0, 8).toUpperCase()}</span>
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
            <div
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </Accordion>
        )}

        <Accordion label="Care Instructions">
          <ul className="space-y-2 text-gray-600">
            {[
              "Dry clean recommended for embroidered pieces",
              "Hand wash in cold water with mild detergent",
              "Do not wring — gently squeeze out excess water",
              "Iron on reverse side at medium heat",
              "Store in a breathable cloth bag away from direct sunlight",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-[#C6A46C] mt-0.5 shrink-0">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </Accordion>

        <Accordion label="Shipping & Returns">
          <ul className="space-y-2 text-gray-600">
            {[
              "Free standard delivery on orders above ₹999",
              "Delivery within 4–7 business days across India",
              "Express delivery available at checkout",
              "Easy 7-day returns — no questions asked",
              "Refund processed within 3–5 business days",
            ].map((info) => (
              <li key={info} className="flex items-start gap-2">
                <span className="text-[#C6A46C] mt-0.5 shrink-0">·</span>
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