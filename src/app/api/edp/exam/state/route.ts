import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase-admin";
import { EXAM_DURATION_SECONDS } from "@/lib/edp/exam-config";
import { toClientQuestions } from "@/lib/edp/server/exam-selection";
import {
    autoFinalizeIfExpired,
    findApplicationRefByUid,
} from "@/lib/edp/server/exam-store";
import { ExamStatePayload } from "@/types/edp-exam";
import { Timestamp } from "firebase-admin/firestore";

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
            const payload: ExamStatePayload = {
                hasApplied: false,
                examStatus: null,
                decision: null,
                resume: null,
            };

            return NextResponse.json(payload);
        }

        let snap = await ref.get();
        let data = snap.data();

        if (!data) {
            const payload: ExamStatePayload = {
                hasApplied: false,
                examStatus: null,
                decision: null,
                resume: null,
            };

            return NextResponse.json(payload);
        }

        // Catch sessions that ran out of time without ever calling
        // /submit (closed tab entirely, phone died, etc.) before we
        // report status back.
        const wasFinalized = await autoFinalizeIfExpired(ref, data);

        if (wasFinalized) {
            snap = await ref.get();
            data = snap.data()!;
        }

        const examStatus = data.examStatus ?? "not_started";
        const decision = data.decision ?? null;

        let resume: ExamStatePayload["resume"] = null;

        if (examStatus === "in_progress") {
            const questionIds: number[] = data.examQuestionIds ?? [];
            const startedAt = data.examStartedAt as Timestamp;

            resume = {
                questions: toClientQuestions(questionIds),
                startedAt: startedAt.toMillis(),
                serverNow: Date.now(),
                durationSeconds: EXAM_DURATION_SECONDS,
                savedAnswers: data.examAnswers ?? {},
            };
        }

        const payload: ExamStatePayload = {
            hasApplied: true,
            examStatus,
            decision,
            resume,
        };

        return NextResponse.json(payload);
    } catch (error) {
        console.error("edp exam state error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
