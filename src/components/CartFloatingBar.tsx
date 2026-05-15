import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ChevronUp, ChevronDown, X, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuthUser } from "@/hooks/useAuth";
import type { CheckoutState } from "@/pages/checkout/CheckoutPage";

const HIDDEN_ROUTES = ["/cart", "/checkout", "/order-success", "/admin", "/login", "/signup"];
const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_FLAT = 70;

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const CartFloatingBar = () => {
  const { items, itemCount, removeItem } = useCart();
  const { data: user } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r))) return null;
  if (itemCount === 0) return null;

  let subtotal = 0;
  let taxAmount = 0;
  for (const item of items) {
    const unitPrice = item.product.discountPrice ?? item.product.marketPrice;
    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;
    taxAmount += itemSubtotal * ((item.product.gstPercent ?? 0) / 100);
  }
  taxAmount = parseFloat(taxAmount.toFixed(2));
  const shipping = subtotal > 1 && subtotal < SHIPPING_FREE_THRESHOLD ? SHIPPING_FLAT : 0;
  const total = parseFloat((subtotal + taxAmount + shipping).toFixed(2));

  const handleCheckout = () => {
    const checkoutState: CheckoutState = { items };
    if (user) {
      navigate("/checkout", { state: checkoutState });
    } else {
      navigate("/login", { state: { from: "/checkout", checkoutState } });
    }
  };

  const ItemList = () => (
    <div className="overflow-y-auto space-y-3 pr-0.5" style={{ maxHeight: "300px" }}>
      {items.map((item) => {
        const unitPrice = item.product.discountPrice ?? item.product.marketPrice;
        return (
          <div
            key={item.variantSizeId}
            className="flex items-center gap-3 pb-3 border-b border-[#F0E8DE] last:border-0 last:pb-0"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.product.title}
                className="w-11 h-11 object-cover rounded-sm border border-[#E8DDD0] shrink-0"
              />
            ) : (
              <div className="w-11 h-11 bg-[#F5EFE7] rounded-sm border border-[#E8DDD0] shrink-0 flex items-center justify-center">
                <ShoppingBag size={13} className="text-[#9A7A46]/40" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#2A1810] truncate font-serif leading-snug">
                {item.product.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500">
                {item.colorLabel && (
                  <span className="flex items-center gap-1 capitalize">
                    {item.colorCode && (
                      <span
                        className="inline-block w-2 h-2 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.colorCode }}
                      />
                    )}
                    {item.colorLabel}
                  </span>
                )}
                {item.sizeLabel && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span>{item.sizeLabel}</span>
                  </>
                )}
                <span className="text-gray-600">·</span>
                <span>×{item.quantity}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-[#2A1810]">
                {formatINR(unitPrice * item.quantity)}
              </span>
              <button
                onClick={() => removeItem(item.variantSizeId)}
                className="text-red-400 transition-colors p-0.5"
                aria-label="Remove"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const TotalsRow = () => (
    <div className="border-t border-[#E8DDD0] pt-2.5 mt-2 space-y-1 text-[11px]">
      <div className="flex justify-between text-gray-500">
        <span>Subtotal</span>
        <span className="font-medium text-gray-700">{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Tax (GST)</span>
        <span className="font-medium text-gray-700">{formatINR(taxAmount)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Shipping</span>
        <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-700"}`}>
          {shipping === 0 ? "Free" : formatINR(shipping)}
        </span>
      </div>
      <div className="flex justify-between pt-1.5 border-t border-[#E8DDD0] font-semibold text-[#2A1810] text-xs">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* ── MOBILE: bottom bar ─────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Expanded panel slides up */}
        <div
          className={`bg-white border-t border-[#E8DDD0] shadow-[0_-6px_30px_rgba(154,122,70,0.12)] overflow-hidden transition-all duration-300 ease-in-out rounded-t-xl ${
            expanded ? "max-h-[60vh]" : "max-h-0"
          }`}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#9A7A46]">
                Basket · {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <ItemList />
            <TotalsRow />
          </div>
        </div>

        {/* Collapsed bar */}
        <div className="bg-white border-t border-[#E8DDD0] shadow-[0_-2px_16px_rgba(154,122,70,0.10)] px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <span className="text-gray-400 shrink-0">
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[#2A1810] text-xs font-semibold tracking-wide">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
                <span className="text-[#9A7A46] text-[14px] font-bold">{formatINR(total)}</span>
              </div>
            </button>

            <div className="w-px h-8 bg-[#E8DDD0] shrink-0" />

            <button
              onClick={handleCheckout}
              className="flex items-center gap-1.5 bg-[#9A7A46] hover:bg-[#B8936A] text-white text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2.5 rounded-sm transition-all duration-200 shrink-0"
            >
              Checkout <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so page content isn't hidden behind the bar on mobile */}
      <div className="md:hidden h-16" aria-hidden="true" />

      {/* ── DESKTOP: right-side floating panel ────────────────────── */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        {/* Expanded card */}
        {expanded && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setExpanded(false)}
            />
            <div className="absolute bottom-full right-0 mb-3 w-80 bg-white border border-[#E8DDD0] rounded-sm shadow-[0_8px_40px_rgba(154,122,70,0.15)] z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DDD0] bg-[#FDFAF6]">
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#9A7A46]">
                  Basket · {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Items */}
              <div className="px-4 pt-3 pb-1">
                <ItemList />
                <TotalsRow />
              </div>

              {/* Checkout CTA */}
              <div className="px-4 pb-4 pt-3">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#9A7A46] hover:bg-[#B8936A] text-white text-xs tracking-[0.18em] uppercase font-medium rounded-sm transition-all duration-200 shadow-[0_2px_12px_rgba(154,122,70,0.3)]"
                >
                  Proceed to Checkout <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Collapsed toggle button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-2.5 bg-white border border-[#E8DDD0] rounded-sm px-4 py-3 shadow-[0_4px_20px_rgba(154,122,70,0.15)] hover:border-[#9A7A46] hover:shadow-[0_4px_20px_rgba(154,122,70,0.25)] transition-all duration-200 ${
            expanded ? "border-[#9A7A46]" : ""
          }`}
        >
          <div className="relative">
            <ShoppingBag size={17} className="text-[#9A7A46]" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#9A7A46] text-white text-[9px] flex items-center justify-center font-bold">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] tracking-[0.1em] uppercase text-gray-500 font-medium leading-none mb-0.5">
              Basket
            </span>
            <span className="text-[#2A1810] text-xs font-bold">{formatINR(total)}</span>
          </div>
          {expanded ? (
            <ChevronDown size={13} className="text-gray-400 ml-1" />
          ) : (
            <ChevronUp size={13} className="text-gray-400 ml-1" />
          )}
        </button>
      </div>
    </>
  );
};

export default CartFloatingBar;
