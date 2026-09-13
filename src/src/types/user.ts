import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "user";

export interface User {
    id: string;

    email: string;
    username?: string;

    role: UserRole;

    createdAt?: Timestamp;
}