import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { useAuthUser } from "@/hooks/useAuth";
import Header from "@/pages/home/components/Header";
import Footer from "@/pages/home/components/Footer";
import type { CheckoutState } from "@/pages/checkout/CheckoutPage";

const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_FLAT = 70;

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { removeItem, updateQuantity } = useCart();

  const maxStock =
    item.product.variants
      .find((v) => v.id === item.variantId)
      ?.sizes.find((s) => s.id === item.variantSizeId)?.stock ?? 99;

  const unitPrice = item.product.discountPrice ?? item.product.marketPrice;
  const unitPriceWithGst = parseFloat((unitPrice * (1 + (item.product.gstPercent ?? 0) / 100)).toFixed(2));

  return (
    <div className="flex gap-4 py-5 border-b border-[#E8DDD0] last:border-0">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.product.title}
          className="w-20 h-20 object-cover rounded-sm border border-[#E8DDD0] shrink-0"
        />
      ) : (
        <div className="w-20 h-20 bg-[#F5EFE7] rounded-sm border border-[#E8DDD0] shrink-0 flex items-center justify-center">
          <ShoppingBag size={20} className="text-[#9A7A46]/40" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-[#2A1810] text-sm leading-snug mb-1 truncate">
          {item.product.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500 mb-2">
          {item.colorLabel && (
            <span className="flex items-center gap-1">
              {item.colorCode && (
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: item.colorCode }}
                />
              )}
              <span className="capitalize">{item.colorLabel}</span>
            </span>
          )}
          {item.sizeLabel && (
            <>
              <span className="text-gray-300">|</span>
              <span>Size: <span className="font-medium text-gray-700">{item.sizeLabel}</span></span>
            </>
          )}
          <span className="text-gray-300">|</span>
          <span>{formatINR(unitPriceWithGst)} each</span>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Quantity control */}
          <div className="flex items-center border border-[#E8DDD0] rounded-sm overflow-hidden">
            <button
              onClick={() => updateQuantity(item.variantSizeId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#9A7A46] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#E8DDD0]"
            >
              <Minus size={11} />
            </button>
            <span className="w-8 text-center text-xs font-medium text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantSizeId, item.quantity + 1)}
              disabled={item.quantity >= maxStock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#9A7A46] hover:bg-[#F5EFE7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-[#E8DDD0]"
            >
              <Plus size={11} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-[#2A1810] text-sm">
              {formatINR(parseFloat((unitPriceWithGst * item.quantity).toFixed(2)))}
            </span>
            <button
              onClick={() => removeItem(item.variantSizeId)}
              className="text-gray-300 hover:text-red-400 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { items, clearCart, itemCount } = useCart();
  const { data: user } = useAuthUser();
  const navigate = useNavigate();

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFAF6]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
          <div className="w-16 h-16 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center">
            <ShoppingBag size={24} className="text-[#9A7A46]/60" />
          </div>
          <p className="text-gray-500 text-sm tracking-wide">Your Cart is empty.</p>
          <Link
            to="/shop"
            className="text-xs tracking-[0.2em] uppercase text-[#9A7A46] border border-[#9A7A46] px-6 py-2.5 hover:bg-[#9A7A46] hover:text-white transition-all"
          >
            Browse Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 md:py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/shop"
              className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
            >
              Shop
            </Link>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
              Cart
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2A1810] tracking-tight">
                Your Cart
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-px w-10 bg-[#9A7A46]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
                <div className="h-px w-6 bg-[#9A7A46]/50" />
              </div>
            </div>
            <button
              onClick={clearCart}
              className="text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={11} /> Clear all
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Items */}
          <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-2">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </h2>
            {items.map((item) => (
              <CartItemRow key={item.variantSizeId} item={item} />
            ))}
          </section>

          {/* Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                  <span className="font-medium text-gray-800">{formatINR(parseFloat((subtotal + taxAmount).toFixed(2)))}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400">
                    Add {formatINR(SHIPPING_FREE_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-[#E8DDD0] pt-2.5 flex justify-between">
                  <span className="font-semibold text-[#2A1810]">Total</span>
                  <span className="font-bold text-[#2A1810] text-lg">{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-5 w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-all duration-200 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              >
                Proceed to Checkout <ArrowRight size={13} />
              </button>

              <Link
                to="/shop"
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-[#E8DDD0] text-gray-500 text-xs tracking-[0.15em] uppercase hover:border-[#9A7A46] hover:text-[#9A7A46] transition-all rounded-sm"
              >
                Continue Shopping
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
