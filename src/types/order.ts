import type { IAddress } from "./address";

export interface IOrderItem {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  product: { id: string; title: string };
}

export interface IOrder {
  id: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  placedAt: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
}
