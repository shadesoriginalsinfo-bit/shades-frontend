import type { IAddress } from "./address";

export type OrderStatus =
  // | "DRAFT"
  "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export const ORDER_STATUSES: OrderStatus[] = [
  // "DRAFT",
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export const STATUS_PROGRESSION: Record<OrderStatus, OrderStatus[]> = {
  // DRAFT: ["CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export interface IPayment {
  id: string;
  method: string;
  provider: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  product: { id: string; title: string };
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: "ONLINE" | "COD";
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  trackingNumber?: string | null;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  payments: IPayment[];
}

export interface IAdminOrder extends IOrder {
  user: {
    id: string;
    name: string;
    email: string;
    mobileNumber: string;
  };
}

export interface IUserOrderQuery {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface IUserOrdersResponse {
  data: IOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAdminOrderQuery {
  status?: OrderStatus;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface IOrdersResponse {
  data: IAdminOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
