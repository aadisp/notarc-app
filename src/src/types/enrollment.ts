import type { Timestamp } from "firebase/firestore";

export interface Enrollment {
    id: string;

    userId: string;
    userEmail: string;

    courseId: string;
    courseName: string;
    courseSlug: string;

    enrolledAt: Timestamp;
}