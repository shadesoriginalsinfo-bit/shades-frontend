import {
  STATUS_PROGRESSION,
  type IAdminOrder,
  type OrderStatus,
} from "@/types/order";
import { useState } from "react";
import { PaymentBadge, StatusBadge } from "./Badges";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailModalProps {
  order: IAdminOrder | null;
  onClose: () => void;
  onStatusUpdate: (
    id: string,
    status: OrderStatus,
    trackingNumber?: string,
  ) => void;
  isPending: boolean;
}

export function OrderDetailModal({
  order,
  onClose,
  onStatusUpdate,
  isPending,
}: DetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber ?? "",
  );

  if (!order) return null;

  const allowedStatuses = STATUS_PROGRESSION[order.status];
  const requiresTracking = selectedStatus === "SHIPPED";
  const canSubmit =
    !!selectedStatus &&
    selectedStatus !== order.status &&
    (!requiresTracking || trackingNumber.trim().length > 0);

  const handleUpdate = () => {
    if (!selectedStatus || !canSubmit) return;
    onStatusUpdate(
      order.id,
      selectedStatus,
      requiresTracking ? trackingNumber.trim() : undefined,
    );
  };

  const handleOnClose = () => {
    setSelectedStatus("");
    setTrackingNumber("");
    onClose();
  };

  const handleStatusChange = (val: OrderStatus | "") => {
    setSelectedStatus(val);
    if (val === "SHIPPED") {
      setTrackingNumber(order?.trackingNumber ?? "");
    } else {
      setTrackingNumber("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 rounded-md">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-0.5">
              Order
            </p>
            <h2 className="text-sm font-medium text-gray-800 font-mono">
              {order.id}
            </h2>
          </div>
          <button
            onClick={handleOnClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status & Payment */}
          <div className="flex flex-wrap gap-3 items-center">
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus} />
            <span className="text-xs text-gray-400">
              Placed{" "}
              {new Date(order.placedAt ?? order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </span>
          </div>

          {/* Update Status */}
          {allowedStatuses.length > 0 ? (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
                Update Status
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as OrderStatus | "")
                      }
                      className="w-full cursor-pointer appearance-none border border-[#E8DDD0] bg-white px-3 py-2.5 pr-9 text-sm text-gray-700 transition-colors hover:border-[#9A7A46]/60 focus:outline-none focus:border-[#9A7A46] focus:ring-1 focus:ring-[#9A7A46]/20"
                    >
                      <option value="">Select new status…</option>
                      {allowedStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  </div>
                  <Button
                    onClick={handleUpdate}
                    disabled={!canSubmit || isPending}
                    className="bg-[#9A7A46] hover:bg-[#b8935d] text-white"
                  >
                    {isPending ? "Saving…" : "Update"}
                  </Button>
                </div>

                {requiresTracking && (
                  <div>
                    <input
                      type="text"
                      placeholder="Tracking number (required)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full border border-[#E8DDD0] px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 transition-colors hover:border-[#9A7A46]/60 focus:outline-none focus:border-[#9A7A46] focus:ring-1 focus:ring-[#9A7A46]/20"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
                Update Status
              </p>
              <p className="text-xs text-gray-400 bg-[#F8F4EE] px-3 py-2.5">
                No further status transitions available for this order.
              </p>
            </div>
          )}

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
                Tracking Number
              </p>
              <p className="bg-[#F8F4EE] px-3 py-2.5 text-sm text-gray-700 font-mono">
                {order.trackingNumber}
              </p>
            </div>
          )}

          {/* Customer */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
              Customer
            </p>
            <div className="bg-[#F8F4EE] p-3 space-y-0.5">
              <p className="text-sm font-medium text-gray-800">
                {order.user.name}
              </p>
              <p className="text-xs text-gray-500">{order.user.email}</p>
              <p className="text-xs text-gray-500">{order.user.mobileNumber}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
              Items
            </p>
            <div className="border border-[#E8DDD0] divide-y divide-[#E8DDD0]">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 gap-3"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {item.variantSize?.variant?.images?.[0] && (
                      <img
                        src={item.variantSize.variant.images[0].url}
                        alt={item.variantSize.variant.images[0].altText ?? item.product.title}
                        className="w-10 h-10 object-cover border border-[#E8DDD0] shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">
                        {item.product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {item.variantSize?.variant?.color && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            {item.variantSize.variant.colorCode && (
                              <span
                                className="inline-block w-2.5 h-2.5 rounded-full border border-gray-200"
                                style={{ backgroundColor: item.variantSize.variant.colorCode }}
                              />
                            )}
                            {item.variantSize.variant.color}
                          </span>
                        )}
                        {item.variantSize?.size && (
                          <span className="text-xs text-gray-400">
                            Size: {item.variantSize.size}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.quantity} × ₹
                        {item.unitPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 shrink-0">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-[#F8F4EE] p-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (GST)</span>
              <span>₹{order.taxAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shippingAmount === 0
                  ? "Free"
                  : `₹${order.shippingAmount.toLocaleString("en-IN")}`}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−₹{order.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-800 border-t border-[#E8DDD0] pt-1.5 mt-1">
              <span>Total</span>
              <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
                Shipping Address
              </p>
              <div className="bg-[#F8F4EE] p-3 text-sm text-gray-600 space-y-0.5">
                {order.shippingAddress.label && (
                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.label}
                  </p>
                )}
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          {order.payments?.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-2">
                Payment
              </p>
              <div className="border border-[#E8DDD0] divide-y divide-[#E8DDD0]">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 capitalize">
                        {p.provider}
                      </span>
                      <PaymentBadge status={p.status} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
