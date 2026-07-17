import type { Timestamp } from "firebase/firestore";
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;

  username: string;
  userEmail: string;

  total: number;

  orderStatus: string;
  paymentStatus: string;

  items: OrderItem[];

  createdAt?: Timestamp;
}