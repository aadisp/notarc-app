import { Timestamp } from "firebase/firestore";

export interface EdpApplication {
    id: string;

    userId: string | null;

    name: string;
    usn: string;
    collegeName: string;
    branch: string;
    section: string;
    semester: number;
    phone: string;
    email: string;

    createdAt: Timestamp;
}