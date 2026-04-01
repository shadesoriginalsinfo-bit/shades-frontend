import type { IAddress } from "./address";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export interface IPayment {
  id: string;
  provider: string;
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
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
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
