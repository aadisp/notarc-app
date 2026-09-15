import { Timestamp } from "firebase/firestore";
import {
    ExamAnswerMap,
    ExamDecision,
    ExamStatus,
    ExamSubmitReason,
} from "./edp-exam";

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

    // Exam fields — all optional since applications created before this
    // feature shipped, or applications that haven't started the exam
    // yet, won't have them.
    examStatus?: ExamStatus;
    examQuestionIds?: number[];
    examStartedAt?: Timestamp;
    examAnswers?: ExamAnswerMap;
    examSubmittedAt?: Timestamp;
    examSubmitReason?: ExamSubmitReason;

    // Score is computed server-side and is intentionally never sent
    // back to the applicant's browser — only read by admin-facing
    // code, which is already gated behind admin-only Firestore access.
    score?: number;
    // Set once an admin has reviewed and saved marking for the typed
    // Section A answers — the true combined score out of
    // EXAM_TOTAL_MARKS (30), covering both the auto-graded MCQs and
    // the admin's manual review.
    finalScore?: number;

    // Set by an admin after reviewing the exam result.
    decision?: ExamDecision;
}