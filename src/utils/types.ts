import type { OrderItem } from './parsing';

export interface PricedOrderItem extends OrderItem {
  productName: string;
  price: number;
  subtotal: number;
}

export interface SavedProduct {
  name: string;
  price: number;
  lastUsed: string;
}

export interface SavedInvoice {
  id: number;
  customerName: string;
  customerAddress: string;
  items: PricedOrderItem[];
  subtotal: number;
  shippingCost: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  date: string;
  isPaid: boolean;
  createdAt: string;
}
