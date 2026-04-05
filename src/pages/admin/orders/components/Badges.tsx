import type { OrderStatus } from "@/types/order";

const STATUS_STYLES: Record<OrderStatus, string> = {
  DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  REFUNDED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-500 border-red-200",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-500",
  REFUNDED: "bg-gray-100 text-gray-500",
};

const PAYMENT_METHOD_STYLES: Record<string, string> = {
  COD: "bg-purple-50 text-purple-700",
  ONLINE: "bg-blue-100 text-blue-500",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium rounded-sm border ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}
    >
      {status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium rounded-sm ${PAYMENT_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

export function PaymentMethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium rounded-sm ${PAYMENT_METHOD_STYLES[method] ?? "bg-gray-100 text-gray-500"}`}
    >
      {method}
    </span>
  );
}