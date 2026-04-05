import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";
import { getAddresses, createAddress, createOrder } from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";
import toast from "react-hot-toast";
import type { IProduct } from "@/types/product";
import type { ICreateAddress } from "@/types/address";
import Header from "@/components/Header";
import Footer from "../home/components/Footer";

// Keep these in sync with backend constants

const SHIPPING_FREE_THRESHOLD = 999;
const SHIPPING_FLAT = 70;

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

interface CheckoutState {
  product: IProduct;
  quantity: number;
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

  const state = location.state as CheckoutState | null;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<ICreateAddress>(emptyAddressForm);

  // Redirect if no checkout state (direct navigation)
  if (!state?.product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-500 text-sm tracking-wide">No product selected for checkout.</p>
        <Link
          to="/shop"
          className="text-xs tracking-[0.2em] uppercase text-[#C6A46C] border border-[#C6A46C] px-6 py-2.5 hover:bg-[#C6A46C] hover:text-white transition-all"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const { product, quantity } = state;
  const unitPrice = product.discountPrice ?? product.marketPrice;
  const subtotal = unitPrice * quantity;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = parseFloat((subtotal + tax + shipping).toFixed(2));

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
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

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      navigate("/order-success", { state: { order } });
    },
    onError: handleApiError,
  });

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    orderMutation.mutate({
      shippingAddressId: selectedAddressId,
      items: [{ productId: product.id, quantity }],
    });
  };

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) ?? addresses.find((a) => a.isDefault);

  // Auto-select default address on first load
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
            <Link to="/shop" className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#C6A46C] transition-colors">Shop</Link>
            <span className="text-gray-300 text-xs">·</span>
            <Link to={`/product/${product.id}`} className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#C6A46C] transition-colors">Product</Link>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">Checkout</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1810] tracking-tight">Checkout</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px w-10 bg-[#C6A46C]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
            <div className="h-px w-6 bg-[#C6A46C]/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Product summary */}
            <section className="bg-white border border-[#E8DDD0] rounded-sm p-5">
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-700 mb-4">
                Order Item
              </h2>
              <div className="flex gap-4">
                {product.images[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].altText ?? product.title}
                    className="w-20 h-20 object-cover rounded-sm border border-[#E8DDD0] shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-[#2A1810] text-base leading-snug mb-1 truncate">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">Qty: <span className="text-gray-800 font-medium">{quantity}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">Unit: <span className="text-gray-800 font-medium">{formatINR(unitPrice)}</span></span>
                  </div>
                  {product.discountPrice && (
                    <p className="text-[11px] text-emerald-600 mt-1 tracking-wide">
                      You save {formatINR((product.marketPrice - unitPrice) * quantity)} on this order
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#2A1810] text-lg">{formatINR(subtotal)}</p>
                </div>
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
                <p className="text-sm text-gray-500 mb-4">No saved addresses. Add one below.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3.5 border rounded-sm cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-[#C6A46C] bg-[#F5EFE7]"
                          : "border-[#E8DDD0] hover:border-[#C6A46C]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 accent-[#C6A46C]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {addr.label && (
                            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#C6A46C]">
                              {addr.label}
                            </span>
                          )}
                          {addr.isDefault && (
                            <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-[#C6A46C]/10 text-[#C6A46C] border border-[#C6A46C]/30 rounded-sm">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.city}{addr.state ? `, ${addr.state}` : ""} — {addr.postalCode}, {addr.country}
                        </p>
                      </div>
                      <MapPin size={14} className="text-[#C6A46C] shrink-0 mt-1" />
                    </label>
                  ))}
                </div>
              )}

              {/* Add new address toggle */}
              <button
                onClick={() => setShowAddressForm((v) => !v)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#C6A46C] font-medium hover:text-[#B8936A] transition-colors"
              >
                <Plus size={13} />
                Add New Address
                {showAddressForm
                  ? <ChevronUp size={12} />
                  : <ChevronDown size={12} />}
              </button>

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="mt-4 space-y-3 border-t border-[#E8DDD0] pt-4">
                  {/* Label */}
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                      Label <span className="text-gray-400 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressFormChange}
                      placeholder="Home / Office"
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                    />
                  </div>

                  {/* Line 1 */}
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="line1"
                      value={addressForm.line1}
                      onChange={handleAddressFormChange}
                      placeholder="House / Flat / Street"
                      required
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                    />
                  </div>

                  {/* Line 2 */}
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                      Landmark <span className="text-gray-400 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      name="line2"
                      value={addressForm.line2}
                      onChange={handleAddressFormChange}
                      placeholder="Near, opposite…"
                      className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                    />
                  </div>

                  {/* City + State */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressFormChange}
                        placeholder="City"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                        State
                      </label>
                      <input
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressFormChange}
                        placeholder="State"
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Country + Postal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                        Country <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressFormChange}
                        placeholder="Country"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
                        Postal Code <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="postalCode"
                        value={addressForm.postalCode}
                        onChange={handleAddressFormChange}
                        placeholder="PIN Code"
                        required
                        className="mt-1 w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Set as default */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressFormChange}
                      className="accent-[#C6A46C]"
                    />
                    <span className="text-xs text-gray-600 tracking-wide">Set as default address</span>
                  </label>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={addAddressMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addAddressMutation.isPending ? (
                        <><Loader2 size={12} className="animate-spin" /> Saving…</>
                      ) : "Save Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddressForm(false); setAddressForm(emptyAddressForm); }}
                      className="px-4 py-2.5 border border-[#E8DDD0] text-gray-500 text-xs tracking-[0.2em] uppercase font-medium hover:border-gray-400 transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
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
                  <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="font-medium text-gray-800">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span className="font-medium text-gray-800">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400 -mt-1">
                    Add {formatINR(SHIPPING_FREE_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-[#E8DDD0] pt-2.5 flex justify-between">
                  <span className="font-semibold text-[#2A1810]">Total</span>
                  <span className="font-bold text-[#2A1810] text-lg">{formatINR(total)}</span>
                </div>
              </div>

              {/* Selected address preview */}
              {activeAddress && (
                <div className="mt-4 p-3 bg-[#F5EFE7] border border-[#E8DDD0] rounded-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={11} className="text-[#C6A46C]" />
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#C6A46C] font-medium">
                      Delivering to
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">
                    {activeAddress.line1}{activeAddress.line2 ? `, ${activeAddress.line2}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeAddress.city}{activeAddress.state ? `, ${activeAddress.state}` : ""} — {activeAddress.postalCode}
                  </p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={orderMutation.isPending || !selectedAddressId}
                className="mt-5 w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              >
                {orderMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Placing Order…</>
                ) : (
                  <><CheckCircle2 size={14} /> Place Order</>
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
