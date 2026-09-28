import { Timestamp } from "firebase/firestore";
import { Address } from "./address";

export type OrderStatus =
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";

export type PaymentStatus =
    | "Pending"
    | "Submitted"
    | "Paid"
    | "Rejected"
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

    // A snapshot of the address at the moment the order was placed —
    // not a reference to the saved address doc, since that doc can be
    // edited or deleted later and the order should keep exactly what
    // was used at checkout. Optional only because orders placed
    // before this feature shipped won't have it.
    shippingAddress?: Address;

    // Only set for UPI orders, once the buyer submits it — the UTR /
    // reference number their UPI app shows after paying. This is what
    // an admin checks against the bank statement before moving
    // paymentStatus to "Paid".
    paymentReference?: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
}