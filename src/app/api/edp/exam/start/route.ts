import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { EXAM_DURATION_SECONDS } from "@/lib/edp/exam-config";
import {
    selectExamQuestionIds,
    toClientQuestions,
} from "@/lib/edp/server/exam-selection";
import {
    autoFinalizeIfExpired,
    findApplicationRefByUid,
} from "@/lib/edp/server/exam-store";
import { ExamStartPayload } from "@/types/edp-exam";

type StartResult =
    | { kind: "already_submitted" }
    | { kind: "resumed"; questionIds: number[]; startedAt: number }
    | { kind: "started"; questionIds: number[]; startedAt: number };

export async function POST(request: NextRequest) {
    try {
        const { idToken } = (await request.json()) as { idToken: string };

        if (!idToken) {
            return NextResponse.json(
                { error: "Missing ID token." },
                { status: 401 }
            );
        }

        let uid: string;

        try {
            const decoded = await adminAuth.verifyIdToken(idToken);
            uid = decoded.uid;
        } catch {
            return NextResponse.json(
                { error: "Your session has expired. Please log in again." },
                { status: 401 }
            );
        }

        const ref = await findApplicationRefByUid(uid);

        if (!ref) {
            return NextResponse.json(
                { error: "Submit your application before starting the exam." },
                { status: 400 }
            );
        }

        // Resolve any stale, already-timed-out session before deciding
        // what "start" should do, so re-opening a long-dead session
        // doesn't hand out a fresh question set for free.
        const preSnap = await ref.get();
        const preData = preSnap.data();

        if (preData) {
            await autoFinalizeIfExpired(ref, preData);
        }

        const result = await adminDb.runTransaction<StartResult>(
            async (tx) => {
                const snap = await tx.get(ref);
                const data = snap.data();

                if (!data) {
                    throw new Error("APPLICATION_NOT_FOUND");
                }

                if (data.examStatus === "submitted") {
                    return { kind: "already_submitted" };
                }

                if (data.examStatus === "in_progress") {
                    const startedAt = data.examStartedAt as Timestamp;

                    return {
                        kind: "resumed",
                        questionIds: data.examQuestionIds ?? [],
                        startedAt: startedAt.toMillis(),
                    };
                }

                const questionIds = selectExamQuestionIds();
                const startedAt = Timestamp.now();

                tx.update(ref, {
                    examStatus: "in_progress",
                    examQuestionIds: questionIds,
                    examStartedAt: startedAt,
                    examAnswers: {},
                });

                return {
                    kind: "started",
                    questionIds,
                    startedAt: startedAt.toMillis(),
                };
            }
        );

        if (result.kind === "already_submitted") {
            return NextResponse.json(
                { error: "You have already completed this exam." },
                { status: 409 }
            );
        }

        const payload: ExamStartPayload = {
            questions: toClientQuestions(result.questionIds),
            startedAt: result.startedAt,
            serverNow: Date.now(),
            durationSeconds: EXAM_DURATION_SECONDS,
        };

        return NextResponse.json(payload);
    } catch (error) {
        if (error instanceof Error && error.message === "APPLICATION_NOT_FOUND") {
            return NextResponse.json(
                { error: "Submit your application before starting the exam." },
                { status: 400 }
            );
        }

        console.error("edp exam start error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
