import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { getUserOrders, cancelOrder } from "@/lib/api";
import type { IOrder, OrderStatus } from "@/types/order";
import { handleApiError } from "@/utils/handleApiError";

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REFUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
};

const CANCELLABLE: OrderStatus[] = ["PENDING", "CONFIRMED"];

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const OrdersTab = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["user-orders", page, statusFilter],
    queryFn: () =>
      getUserOrders({ page, limit: 10, status: statusFilter || undefined }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      toast.success("Order cancelled");
    },
    onError: handleApiError,
    onSettled: () => setCancellingId(null),
  });

  const orders: IOrder[] = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-500 mr-1">
          Filter:
        </p>
        {(
          [
            "",
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ] as const
        ).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm border transition-all ${
              statusFilter === s
                ? "bg-[#2A1810] text-white border-[#2A1810]"
                : "border-[#E8DDD0] text-gray-500 hover:border-[#C6A46C] hover:text-[#C6A46C] bg-white"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#C6A46C]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#E8DDD0] rounded-sm py-14 flex flex-col items-center gap-3">
          <ShoppingBag size={32} className="text-[#C6A46C]/40" />
          <p className="text-sm text-gray-400 tracking-wide">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E8DDD0] rounded-sm overflow-hidden"
            >
              {/* Order header row */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              >
                <div className="flex items-center gap-4 flex-wrap ">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">
                      Order ID
                    </p>
                    <p className="text-xs font-mono text-gray-700 mt-0.5">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">
                      Placed
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {formatDate(order.placedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">
                      Total
                    </p>
                    <p className="text-sm font-bold text-[#2A1810] mt-0.5">
                      {formatINR(order.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm border font-medium ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {CANCELLABLE.includes(order.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Cancel this order?")) {
                          setCancellingId(order.id);
                          cancelMutation.mutate(order.id);
                        }
                      }}
                      disabled={
                        cancelMutation.isPending && cancellingId === order.id
                      }
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-red-500 border border-red-200 px-2.5 py-1.5 rounded-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancelMutation.isPending && cancellingId === order.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : null}
                      Cancel
                    </button>
                  )}
                  <span className="text-gray-400 text-xs">
                    {expandedId === order.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded order details */}
              {expandedId === order.id && (
                <div className="border-t border-[#E8DDD0] px-5 py-4 bg-white space-y-4">
                  {/* Items */}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-2">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              {item.product.title}
                            </span>
                            <span className="text-gray-400 text-xs">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {formatINR(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-[#E8DDD0] pt-3 space-y-1.5">
                    {[
                      { label: "Subtotal", value: order.subtotal },
                      { label: "Tax (GST)", value: order.taxAmount },
                      { label: "Shipping", value: order.shippingAmount },
                      ...(order.discountAmount > 0
                        ? [{ label: "Discount", value: -order.discountAmount }]
                        : []),
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between text-xs text-gray-500"
                      >
                        <span>{label}</span>
                        <span className={value < 0 ? "text-emerald-600" : ""}>
                          {formatINR(Math.abs(value))}
                          {value < 0 ? " off" : ""}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold text-[#2A1810] border-t border-[#E8DDD0] pt-2 mt-1">
                      <span>Total</span>
                      <span>{formatINR(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Tracking number */}
                  
                  <div className="border-t border-[#E8DDD0] pt-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">
                      Tracking Number
                    </p>
                    <p className="text-xs font-mono text-gray-700">
                      {order.trackingNumber ?? "N/A"}
                    </p>
                  </div>
                  

                  {/* Shipping address */}
                  <div className="border-t border-[#E8DDD0] pt-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">
                      Shipping To
                    </p>
                    <p className="text-xs text-gray-700">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2
                        ? `, ${order.shippingAddress.line2}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.shippingAddress.city}
                      {order.shippingAddress.state
                        ? `, ${order.shippingAddress.state}`
                        : ""}{" "}
                      — {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-2 border border-[#E8DDD0] rounded-sm text-gray-500 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs text-gray-500 tracking-wide">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === meta.totalPages}
            className="p-2 border border-[#E8DDD0] rounded-sm text-gray-500 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
