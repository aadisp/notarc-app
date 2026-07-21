export type OrderStatus =
    | "pending"
    | "paid"
    | "processing"
    | "completed"
    | "cancelled";

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
    userEmail: string;

    items: OrderItem[];

    subtotal: number;
    tax: number;
    shipping: number;
    total: number;

    status: OrderStatus;

    paymentMethod: string;

    createdAt: Date;
    updatedAt: Date;
}