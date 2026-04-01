import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, MapPin, Package } from "lucide-react";
import type { IOrder } from "@/types/order";
import Header from "@/components/Header";

const formatINR = (amount: number) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = (location.state as { order?: IOrder } | null)?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-500 text-sm tracking-wide">No order information found.</p>
        <Link
          to="/shop"
          className="text-xs tracking-[0.2em] uppercase text-[#C6A46C] border border-[#C6A46C] px-6 py-2.5 hover:bg-[#C6A46C] hover:text-white transition-all"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6]">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-20">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1810] tracking-tight mb-1">
            Order Placed Successfully
          </h1>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px w-10 bg-[#C6A46C]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
            <div className="h-px w-6 bg-[#C6A46C]/50" />
          </div>
          <p className="text-sm text-gray-500 tracking-wide">
            Thank you for shopping with us. Your order is confirmed.
          </p>
          <p className="text-xs text-gray-400 mt-1 font-mono tracking-widest uppercase">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="space-y-5">
          {/* Items */}
          <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package size={14} className="text-[#C6A46C]" />
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700">
                Items Ordered
              </h2>
            </div>
            <div className="divide-y divide-[#E8DDD0]">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 text-sm first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-[#2A1810]">{item.product.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity} &times; {formatINR(Number(item.unitPrice))}
                    </p>
                  </div>
                  <span className="font-semibold text-[#2A1810]">
                    {formatINR(Number(item.totalPrice))}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Price breakdown */}
          <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">{formatINR(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span className="font-medium text-gray-800">{formatINR(Number(order.taxAmount))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${Number(order.shippingAmount) === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                  {Number(order.shippingAmount) === 0 ? "Free" : formatINR(Number(order.shippingAmount))}
                </span>
              </div>
              <div className="border-t border-[#E8DDD0] pt-2.5 flex justify-between">
                <span className="font-semibold text-[#2A1810]">Total Paid</span>
                <span className="font-bold text-[#2A1810] text-lg">{formatINR(Number(order.totalAmount))}</span>
              </div>
            </div>
          </section>

          {/* Shipping address */}
          <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-[#C6A46C]" />
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700">
                Delivering To
              </h2>
            </div>
            <div className="bg-[#F5EFE7] border border-[#E8DDD0] rounded-sm p-3 text-sm">
              {addr.label && (
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#C6A46C] font-semibold mb-1">
                  {addr.label}
                </p>
              )}
              <p className="text-gray-700">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                {addr.city}{addr.state ? `, ${addr.state}` : ""} — {addr.postalCode}, {addr.country}
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/shop"
              className="flex-1 py-3.5 text-center bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all duration-200 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="px-6 py-3.5 text-center border border-[#E8DDD0] text-gray-600 text-xs tracking-[0.2em] uppercase font-medium hover:border-[#C6A46C] hover:text-[#C6A46C] transition-all duration-200 rounded-sm"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
