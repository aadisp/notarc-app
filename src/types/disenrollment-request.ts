import type { Timestamp } from "firebase/firestore";

export type DisenrollmentRequestStatus =
    | "pending"
    | "approved"
    | "denied";

export interface DisenrollmentRequest {
    id: string;

    userId: string;
    userEmail: string;

    enrollmentId: string;
    courseId: string;
    courseName: string;
    courseSlug: string;

    status: DisenrollmentRequestStatus;

    requestedAt: Timestamp;
    reviewedAt?: Timestamp;
}