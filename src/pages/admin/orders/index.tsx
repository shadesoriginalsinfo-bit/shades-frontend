import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { handleApiError } from "@/utils/handleApiError";
import { adminUpdateOrderStatus } from "@/lib/api";
import { ORDERS_QUERY_KEY, useOrders } from "@/hooks/useOrders";
import {
  ORDER_STATUSES,
  type IAdminOrder,
  type OrderStatus,
} from "@/types/order";
import { OrderDetailModal } from "./components/OrderModal";
import {
  PaymentBadge,
  PaymentMethodBadge,
  StatusBadge,
} from "./components/Badges";

const LIMIT = 20;

const OrdersPage = () => {
  const queryClient = useQueryClient();

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [page, setPage] = useState(1);

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<IAdminOrder | null>(null);

  const { orders, meta, isLoading } = useOrders({
    status: statusFilter || undefined,
    userId: userIdFilter.trim() || undefined,
    from: fromFilter || undefined,
    to: toFilter || undefined,
    page,
    limit: LIMIT,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      trackingNumber,
    }: {
      id: string;
      status: OrderStatus;
      trackingNumber?: string;
    }) => adminUpdateOrderStatus(id, status, trackingNumber),
    onSuccess: (updated) => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      setSelectedOrder((prev) =>
        prev
          ? { ...prev, status: (updated as IAdminOrder).status ?? prev.status }
          : prev,
      );
    },
    onError: handleApiError,
  });

  const resetFilters = () => {
    setStatusFilter("");
    setUserIdFilter("");
    setFromFilter("");
    setToFilter("");
    setPage(1);
  };

  const hasActiveFilters =
    statusFilter || userIdFilter || fromFilter || toFilter;

  return (
    <div className="space-y-4 p-1 md:p-4">
      <h1 className="text-2xl font-light tracking-tight text-gray-800 font-serif">
        Orders
      </h1>

      {/* Filters */}
      <div className="bg-white border border-[#E8DDD0] p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Status */}
          <div className="flex flex-col gap-1 min-w-35">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as OrderStatus | "");
                  setPage(1);
                }}
                className="w-full cursor-pointer appearance-none border border-[#E8DDD0] bg-white px-3 py-2 pr-9 text-sm text-gray-700 transition-colors hover:border-[#9A7A46]/60 focus:outline-none focus:border-[#9A7A46] focus:ring-1 focus:ring-[#9A7A46]/20"
              >
                <option value="">All statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            </div>
          </div>

          {/* User ID */}
          <div className="flex flex-col gap-1 min-w-50">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              User ID
            </label>
            <input
              type="text"
              placeholder="Filter by user ID…"
              value={userIdFilter}
              onChange={(e) => {
                setUserIdFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#E8DDD0] px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#9A7A46]"
            />
          </div>

          {/* From date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              From
            </label>
            <input
              type="date"
              value={fromFilter}
              onChange={(e) => {
                setFromFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#E8DDD0] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
            />
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              To
            </label>
            <input
              type="date"
              value={toFilter}
              onChange={(e) => {
                setToFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#E8DDD0] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="self-end text-gray-500 hover:text-gray-700"
            >
              <X className="size-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DDD0] overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#9A7A46]">
            <svg
              className="animate-spin size-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="ml-2 text-sm">Loading orders…</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ShoppingBag className="size-10 mb-3 opacity-30" />
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8DDD0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Customer
                </th>
                <th className="min-w-38 text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Payment Method
                </th>
                <th className="min-w-40 text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Order Status
                </th>
                <th className="min-w-40 text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium ">
                  Payment Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Tracking Id
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Total
                </th>
                <th className="min-w-40 text-center px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Placed At
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Updated At
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#E8DDD0] hover:bg-[#FDFAF6] transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-600">
                      {order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 ">
                    <p className="font-medium text-gray-800 leading-tight">
                      {order.user.name}
                    </p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>

                  {/* payment method */}
                  <td className="px-4 py-3">
                    <PaymentMethodBadge method={order.paymentMethod} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Payment status */}
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.paymentStatus} />
                  </td>

                  {/* Tracking Id */}
                  <td className="px-4 py-3 ">
                    <span className="text-xs text-gray-500">
                      {order.trackingNumber || "N/A"}
                    </span>
                  </td>

                  {/* Items count */}
                  {/* <td className="px-4 py-3 ">
                    <span className="text-xs text-gray-500">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </span>
                  </td> */}

                  {/* Total */}
                  <td className="px-4 py-3 text-left">
                    <span className="font-medium text-gray-800">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 min-w-28 ">
                    <span className="text-xs text-gray-400">
                      {new Date(
                        order.placedAt ?? order.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>

                  <td className="px-4 py-3 min-w-28 ">
                    <span className="text-xs text-gray-400">
                      {new Date(order.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      className="border-[#E8DDD0] text-[#9A7A50] hover:bg-[#F8F4EE] hover:border-[#9A7A46] text-xs"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={LIMIT}
          onPageChange={(val) => setPage(val)}
        />
      )}

      {/* Order Detail / Status Update Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={(id, status, trackingNumber) =>
          updateStatusMutation.mutate({ id, status, trackingNumber })
        }
        isPending={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default OrdersPage;
