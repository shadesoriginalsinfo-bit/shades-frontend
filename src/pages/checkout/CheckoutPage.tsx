import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  CreditCard,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import {
  getAddresses,
  createAddress,
  createOrder,
  initiatePayment,
  verifyPayment,
  getAppConfig,
  validateCoupon,
  getActiveCoupons,
} from "@/lib/api";
import type { IAppliedCoupon } from "@/types/coupon";
import { handleApiError } from "@/utils/handleApiError";
import { useRazorpay } from "@/hooks/useRazorpay";
import toast from "react-hot-toast";
import type { ICreateAddress } from "@/types/address";
import Header from "@/components/Header";
import Footer from "../home/components/Footer";
import { useCart, type CartItem } from "@/context/CartContext";

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export interface CheckoutState {
  items: CartItem[];
}

const emptyAddressForm: ICreateAddress = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  isDefault: false,
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  const state = location.state as CheckoutState | null;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] =
    useState<ICreateAddress>(emptyAddressForm);
  const [paymentMethod] = useState<"ONLINE">("ONLINE");
  const [appliedCoupon, setAppliedCoupon] = useState<IAppliedCoupon | null>(
    null,
  );
  const [validatingCode, setValidatingCode] = useState<string | null>(null);

  if (!state?.items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white py-4">
        <p className="text-gray-500 text-sm tracking-wide">
          No items selected for checkout.
        </p>
        <Link
          to="/shop"
          className="text-xs tracking-[0.2em] uppercase text-[#9A7A46] border border-[#9A7A46] px-6 py-2.5 hover:bg-[#9A7A46] hover:text-white transition-all"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const { items } = state;

  const { data: appConfig } = useQuery({
    queryKey: ["app-config"],
    queryFn: getAppConfig,
    staleTime: 5 * 60 * 1000,
  });

  const SHIPPING_FLAT = parseFloat(appConfig?.SHIPPING_FLAT ?? "70");
  const SHIPPING_FREE_THRESHOLD = parseFloat(
    appConfig?.SHIPPING_FREE_THRESHOLD ?? "500",
  );

  // Aggregate totals
  let subtotal = 0;
  let taxAmount = 0;
  for (const item of items) {
    const unitPrice = item.product.discountPrice ?? item.product.marketPrice;
    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;
    taxAmount += itemSubtotal * ((item.product.gstPercent ?? 0) / 100);
  }
  taxAmount = parseFloat(taxAmount.toFixed(2));
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const shipping =
    subtotal > 1 && subtotal < SHIPPING_FREE_THRESHOLD ? SHIPPING_FLAT : 0;
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = parseFloat(
    (subtotal + taxAmount + shipping - discount).toFixed(2),
  );

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const { data: availableCoupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ["active-coupons"],
    queryFn: getActiveCoupons,
    staleTime: 2 * 60 * 1000,
  });

  const addAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
      setAddressForm(emptyAddressForm);
      toast.success("Address added");
    },
    onError: handleApiError,
  });

  const { openRazorpay } = useRazorpay();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onError: handleApiError,
  });

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ICreateAddress = {
      ...addressForm,
      label: addressForm.label || undefined,
      line2: addressForm.line2 || undefined,
      state: addressForm.state || undefined,
    };
    addAddressMutation.mutate(payload);
  };

  const handleSelectCoupon = async (code: string) => {
    if (validatingCode) return;
    setValidatingCode(code);
    try {
      const result = await validateCoupon(code, parseFloat((subtotal + taxAmount).toFixed(2)));
      setAppliedCoupon(result);
      toast.success(`Coupon applied — ${formatINR(result.discountAmount)} off`);
    } catch (err) {
      handleApiError(err);
    } finally {
      setValidatingCode(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    let order;
    try {
      order = await orderMutation.mutateAsync({
        shippingAddressId: selectedAddressId,
        paymentMethod,
        items: items.map((i) => ({
          variantSizeId: i.variantSizeId,
          quantity: i.quantity,
        })),
        ...(appliedCoupon && { couponCode: appliedCoupon.code }),
      });
    } catch {
      return;
    }

    let paymentData;
    try {
      setIsPaymentProcessing(true);
      paymentData = await initiatePayment(order.id);
    } catch (err) {
      handleApiError(err);
      setIsPaymentProcessing(false);
      return;
    }

    const firstItem = items[0];

    openRazorpay({
      key: import.meta.env.VITE_RZP_KEY_ID,
      amount: Math.round(Number(paymentData.amount) * 100),
      currency: paymentData.currency,
      order_id: paymentData.razorpayOrderId,
      name: "Shades",
      description:
        items.length === 1 ? firstItem.product.title : `${items.length} items`,
      image: firstItem.imageUrl,
      theme: { color: "#9A7A46" },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          toast.success("Payment successful!");
          clearCart();
          navigate("/order-success", { state: { order } });
        } catch (err) {
          handleApiError(err);
        } finally {
          setIsPaymentProcessing(false);
        }
      },
      modal: {
        ondismiss: () => setIsPaymentProcessing(false),
      },
    });
  };

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) ??
    addresses.find((a) => a.isDefault);

  if (!selectedAddressId && addresses.length > 0) {
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddressId(def.id);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-24">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/shop"
              className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
            >
              Shop
            </Link>
            <span className="text-gray-300 text-xs">·</span>
            <Link
              to="/cart"
              className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
            >
              Cart
            </Link>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
              Checkout
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1810] tracking-tight">
            Checkout
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px w-10 bg-[#9A7A46]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
            <div className="h-px w-6 bg-[#9A7A46]/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Order items */}
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Order Items ({totalQty})
              </h2>
              <div className="space-y-4">
                {items.map((item) => {
                  const unitPrice =
                    item.product.discountPrice ?? item.product.marketPrice;
                  const gstRate = (item.product.gstPercent ?? 0) / 100;
                  const unitPriceWithGst = parseFloat(
                    (unitPrice * (1 + gstRate)).toFixed(2),
                  );
                  return (
                    <div
                      key={item.variantSizeId}
                      className="flex gap-4 pb-4 border-b border-[#F0E8DE] last:border-0 last:pb-0"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-sm border border-[#E8DDD0] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#F5EFE7] rounded-sm border border-[#E8DDD0] shrink-0 flex items-center justify-center">
                          <ShoppingBag
                            size={16}
                            className="text-[#9A7A46]/40"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-semibold text-[#2A1810] text-sm leading-snug mb-1 truncate">
                          {item.product.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          <span>
                            Qty:{" "}
                            <span className="text-gray-800 font-medium">
                              {item.quantity}
                            </span>
                          </span>
                          {item.colorLabel && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="flex items-center gap-1">
                                {item.colorCode && (
                                  <span
                                    className="inline-block w-2.5 h-2.5 rounded-full border border-gray-200"
                                    style={{ backgroundColor: item.colorCode }}
                                  />
                                )}
                                <span className="capitalize">
                                  {item.colorLabel}
                                </span>
                              </span>
                            </>
                          )}
                          {item.sizeLabel && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span>
                                Size:{" "}
                                <span className="text-gray-800 font-medium">
                                  {item.sizeLabel}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#2A1810] text-sm">
                          {formatINR(
                            parseFloat(
                              (unitPriceWithGst * item.quantity).toFixed(2),
                            ),
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {formatINR(unitPriceWithGst)} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Delivery address */}
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Delivery Address
              </h2>

              {addressesLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <Loader2 size={14} className="animate-spin" />
                  Loading addresses…
                </div>
              ) : addresses.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">
                  No saved addresses. Add one below.
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3.5 border rounded-sm cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-[#9A7A46] bg-[#F5EFE7]"
                          : "border-[#E8DDD0] hover:border-[#9A7A46]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 accent-[#9A7A46]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {addr.label && (
                            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#9A7A46]">
                              {addr.label}
                            </span>
                          )}
                          {addr.isDefault && (
                            <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-[#9A7A46]/10 text-[#9A7A46] border border-[#9A7A46]/30 rounded-sm">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.city}
                          {addr.state ? `, ${addr.state}` : ""} —{" "}
                          {addr.postalCode}, {addr.country}
                        </p>
                      </div>
                      <MapPin
                        size={14}
                        className="text-[#9A7A46] shrink-0 mt-1"
                      />
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowAddressForm((v) => !v)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#9A7A46] font-medium hover:text-[#B8936A] transition-colors"
              >
                <Plus size={13} />
                Add New Address
                {showAddressForm ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>

              {showAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="mt-4 space-y-3 border-t border-[#E8DDD0] pt-4"
                >
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                      Label{" "}
                      <span className="text-gray-400 normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressFormChange}
                      placeholder="Home / Office"
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="line1"
                      value={addressForm.line1}
                      onChange={handleAddressFormChange}
                      placeholder="House / Flat / Street"
                      required
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                      Landmark{" "}
                      <span className="text-gray-400 normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      name="line2"
                      value={addressForm.line2}
                      onChange={handleAddressFormChange}
                      placeholder="Near, opposite…"
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressFormChange}
                        placeholder="City"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                        State
                      </label>
                      <input
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressFormChange}
                        placeholder="State"
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                        Country <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressFormChange}
                        placeholder="Country"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
                        Postal Code <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="postalCode"
                        value={addressForm.postalCode}
                        onChange={handleAddressFormChange}
                        placeholder="PIN Code"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressFormChange}
                      className="accent-[#9A7A46]"
                    />
                    <span className="text-xs text-gray-600 tracking-wide">
                      Set as default address
                    </span>
                  </label>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={addAddressMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addAddressMutation.isPending ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Saving…
                        </>
                      ) : (
                        "Save Address"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm(emptyAddressForm);
                      }}
                      className="px-4 py-2.5 border border-[#E8DDD0] text-gray-500 text-xs tracking-[0.2em] uppercase font-medium hover:border-gray-400 transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Coupon */}
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Coupon
              </h2>

              {/* Applied state */}
              {appliedCoupon && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-sm mb-3">
                  <Tag size={13} className="text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-semibold text-emerald-700">
                      {appliedCoupon.code}
                    </p>
                    {appliedCoupon.description && (
                      <p className="text-xs text-emerald-600 truncate">
                        {appliedCoupon.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-emerald-700 shrink-0">
                    -{formatINR(appliedCoupon.discountAmount)}
                  </span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-emerald-400 hover:text-emerald-700 transition-colors shrink-0"
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Coupon list */}
              {couponsLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                  <Loader2 size={12} className="animate-spin" /> Loading offers…
                </div>
              ) : availableCoupons.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No coupons available right now.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                  {availableCoupons.map((coupon) => {
                    const eligible = subtotal >= coupon.thresholdAmount;
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const isLoading = validatingCode === coupon.code;
                    return (
                      <button
                        key={coupon.code}
                        type="button"
                        disabled={!eligible || !!validatingCode || isApplied}
                        onClick={() =>
                          !isApplied && handleSelectCoupon(coupon.code)
                        }
                        className={`w-full text-left flex items-center gap-3 p-3 border rounded-sm transition-all ${
                          isApplied
                            ? "border-emerald-300 bg-emerald-50 cursor-default"
                            : eligible
                              ? "border-[#E8DDD0] hover:border-[#9A7A46] hover:bg-[#FDFAF6] cursor-pointer"
                              : "border-[#E8DDD0] opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-semibold text-[#2A1810] text-sm tracking-wider">
                              {coupon.code}
                            </span>
                            <span className="text-[10px] tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm">
                              -{formatINR(coupon.discountAmount)} off
                            </span>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {coupon.description}
                            </p>
                          )}
                          <p className="text-[10px] mt-0.5">
                            {eligible ? (
                              <span className="text-gray-400">
                                Min order {formatINR(coupon.thresholdAmount)}
                              </span>
                            ) : (
                              <span className="text-amber-600">
                                Add{" "}
                                {formatINR(coupon.thresholdAmount - subtotal)}{" "}
                                more to unlock
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isLoading ? (
                            <Loader2
                              size={14}
                              className="animate-spin text-[#9A7A46]"
                            />
                          ) : isApplied ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <span className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46] font-medium">
                              Apply
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Payment method */}
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Payment Method
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3.5 border border-[#9A7A46] bg-[#F5EFE7] rounded-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked
                    readOnly
                    className="accent-[#9A7A46]"
                  />
                  <CreditCard size={15} className="text-[#9A7A46] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Online Payment
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Credit / Debit card, UPI, Net banking
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* ── Right column: order summary ── */}
          <div className="lg:sticky lg:top-6 h-fit space-y-4">
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({totalQty} item{totalQty > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatINR(parseFloat((subtotal + taxAmount).toFixed(2)))}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-800"}`}
                  >
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400 -mt-1">
                    Add {formatINR(SHIPPING_FREE_THRESHOLD - subtotal)} more for
                    free shipping
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1.5">
                      <Tag size={11} />
                      {appliedCoupon.code}
                    </span>
                    <span className="font-medium">
                      -{formatINR(appliedCoupon.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-[#E8DDD0] pt-2.5 flex justify-between">
                  <span className="font-semibold text-[#2A1810]">Total</span>
                  <span className="font-bold text-[#2A1810] text-lg">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              {activeAddress && (
                <div className="mt-4 p-3 bg-[#F5EFE7] border border-[#E8DDD0] rounded-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={11} className="text-[#9A7A46]" />
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46] font-medium">
                      Delivering to
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">
                    {activeAddress.line1}
                    {activeAddress.line2 ? `, ${activeAddress.line2}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeAddress.city}
                    {activeAddress.state
                      ? `, ${activeAddress.state}`
                      : ""} — {activeAddress.postalCode}
                  </p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={
                  orderMutation.isPending ||
                  isPaymentProcessing ||
                  !selectedAddressId
                }
                className="mt-5 w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              >
                {orderMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Creating
                    Order…
                  </>
                ) : isPaymentProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Processing
                    Payment…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-3 tracking-wide">
                Secure &nbsp;·&nbsp; Trusted &nbsp;·&nbsp; Exclusive
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
