export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;

    createdAt: Date;

    status: "new" | "read" | "resolved";
}