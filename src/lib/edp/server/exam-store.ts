/**
 * SERVER-ONLY. Shared Firestore helpers for the EDP exam API routes,
 * so the transaction/expiry/scoring logic lives in exactly one place
 * instead of being copy-pasted across start/answer/submit/state.
 */

import {
    DocumentData,
    DocumentReference,
    Timestamp,
} from "firebase-admin/firestore";

import { adminDb } from "@/firebase/firebase-admin";
import { EXAM_DURATION_SECONDS } from "@/lib/edp/exam-config";
import { ExamAnswerMap, ExamSubmitReason } from "@/types/edp-exam";
import { scoreExam } from "./exam-selection";

const APPLICATIONS_COLLECTION = "edpApplications";

export async function findApplicationRefByUid(
    uid: string
): Promise<DocumentReference<DocumentData> | null> {
    const snap = await adminDb
        .collection(APPLICATIONS_COLLECTION)
        .where("userId", "==", uid)
        .limit(1)
        .get();

    if (snap.empty) return null;

    return snap.docs[0].ref;
}

export function examDeadlineMillis(startedAt: Timestamp): number {
    return startedAt.toMillis() + EXAM_DURATION_SECONDS * 1000;
}

export function isExamExpired(data: DocumentData): boolean {
    if (data.examStatus !== "in_progress") return false;

    const startedAt = data.examStartedAt as Timestamp | undefined;
    if (!startedAt) return false;

    return Date.now() >= examDeadlineMillis(startedAt);
}

/**
 * Keeps only answers for questions that were actually assigned to
 * this exam, with a valid option id — never trusts a client payload
 * (or an old autosave) as-is.
 */
export function sanitizeAnswers(
    raw: unknown,
    questionIds: number[]
): ExamAnswerMap {
    const validIds = new Set(questionIds.map(String));
    const validOptions = new Set(["A", "B", "C", "D"]);
    const out: ExamAnswerMap = {};

    if (raw && typeof raw === "object") {
        for (const [key, value] of Object.entries(
            raw as Record<string, unknown>
        )) {
            if (validIds.has(key) && validOptions.has(value as string)) {
                out[key] = value as ExamAnswerMap[string];
            }
        }
    }

    return out;
}

/**
 * Atomically flips an in-progress exam to "submitted" and scores it.
 * Safe to call more than once, or from overlapping requests (e.g. a
 * timeout and a tab-switch firing within milliseconds of each other)
 * — only the first call that observes "in_progress" inside the
 * transaction actually writes; every later call is a no-op.
 *
 * When `answers` is omitted, whatever was last autosaved on the
 * document is used instead — this is the path taken when a session
 * is discovered to be expired lazily (e.g. the applicant simply
 * closed their browser and never came back).
 */
export async function finalizeExam(
    ref: DocumentReference<DocumentData>,
    answers: ExamAnswerMap | undefined,
    reason: ExamSubmitReason
): Promise<{ alreadyFinal: boolean }> {
    return adminDb.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const data = snap.data();

        if (!data || data.examStatus !== "in_progress") {
            return { alreadyFinal: true };
        }

        const questionIds: number[] = data.examQuestionIds ?? [];
        const source = answers ?? (data.examAnswers as ExamAnswerMap) ?? {};
        const cleanAnswers = sanitizeAnswers(source, questionIds);
        const score = scoreExam(questionIds, cleanAnswers);

        tx.update(ref, {
            examStatus: "submitted",
            examAnswers: cleanAnswers,
            examSubmittedAt: Timestamp.now(),
            examSubmitReason: reason,
            score,
            decision: data.decision ?? "pending",
        });

        return { alreadyFinal: false };
    });
}

/**
 * Called at the top of any exam route that reads exam state: if the
 * stored session has run past its time limit but was never properly
 * submitted (app crashed, phone died, tab silently killed by the OS
 * without firing any JS events), finalize it now using whatever
 * answers were last autosaved. Returns true if it just finalized
 * something, so the caller knows to re-read the document.
 */
export async function autoFinalizeIfExpired(
    ref: DocumentReference<DocumentData>,
    data: DocumentData
): Promise<boolean> {
    if (!isExamExpired(data)) return false;

    await finalizeExam(ref, undefined, "timeout");
    return true;
}
