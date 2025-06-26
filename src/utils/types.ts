import type { OrderItem } from './parsing';

export interface PricedOrderItem extends OrderItem {
  productName: string;
  price: number;
  subtotal: number;
}
