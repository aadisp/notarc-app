/**
 * Types shared between the EDP exam frontend and its API routes.
 * None of these carry correct-answer data — that lives only in the
 * server-only question bank (src/lib/edp/server/question-bank.ts) and
 * is never sent to the client.
 */

export type ExamStatus = "not_started" | "in_progress" | "submitted";

export type ExamSubmitReason = "manual" | "timeout" | "left_page";

export type ExamDecision = "pending" | "selected" | "rejected";

export interface ClientExamOption {
    id: "A" | "B" | "C" | "D";
    text: string;
}

export interface ClientExamQuestion {
    id: number;
    prompt: string;
    options: ClientExamOption[];
}

/**
 * What /api/edp/exam/start returns. `startedAt` and `serverNow` are
 * both server epoch-millis timestamps, so the client can compute a
 * countdown that isn't dependent on (or spoofable via) the device's
 * own clock.
 */
export interface ExamStartPayload {
    questions: ClientExamQuestion[];
    startedAt: number;
    serverNow: number;
    durationSeconds: number;
    // Only present when resuming an in-progress exam (e.g. after a
    // page reload) — lets the exam page restore previously-selected
    // answers instead of starting the applicant over from blank.
    savedAnswers?: ExamAnswerMap;
}

/**
 * A map of question id -> selected option id, keyed as strings since
 * Firestore map keys must be strings.
 */
export type ExamAnswerMap = Record<string, "A" | "B" | "C" | "D">;

/**
 * What /api/edp/exam/state returns to drive the frontend's rendering
 * decision (apply form / begin exam / resume / awaiting result /
 * decision message). `resume` is only populated when status is
 * "in_progress", so a page refresh mid-exam can pick back up with the
 * same question set and correct remaining time instead of restarting.
 */
export interface ExamStatePayload {
    hasApplied: boolean;
    examStatus: ExamStatus | null;
    decision: ExamDecision | null;
    resume: ExamStartPayload | null;
}