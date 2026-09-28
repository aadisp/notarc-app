import { Timestamp } from "firebase/firestore";

export interface Address {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
}

/**
 * A saved, reusable address (stored in the top-level `addresses`
 * collection, one doc per address, scoped by `userId`). `lastUsedAt`
 * drives the "3 most recent" selector on checkout — it's bumped
 * every time the address is chosen for an order, not just when it's
 * created, so the list reflects what's actually been used recently
 * rather than just what was added most recently.
 */
export interface SavedAddress extends Address {
    id: string;
    userId: string;
    createdAt: Timestamp | null;
    lastUsedAt: Timestamp | null;
}
