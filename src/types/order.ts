import { Timestamp } from "firebase/firestore";

export type OrderStatus =
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";

export type PaymentStatus =
    | "Pending"
    | "Paid"
    | "Refunded";

export type ShippingStatus =
    | "Pending"
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";

export interface OrderItem {
    id: string;
    type: "product" | "course";
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
}

export interface Order {
    id: string;
    userId: string;
    username?: string;
    userEmail: string;

    items: OrderItem[];

    subtotal: number;
    tax: number;
    shipping: number;
    total: number;

    status: OrderStatus;

    paymentStatus: PaymentStatus;

    shippingStatus: ShippingStatus;

    paymentMethod: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
}