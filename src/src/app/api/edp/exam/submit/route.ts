import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase-admin";
import { finalizeExam, findApplicationRefByUid } from "@/lib/edp/server/exam-store";
import { ExamAnswerMap, ExamSubmitReason } from "@/types/edp-exam";

const VALID_REASONS: ExamSubmitReason[] = ["manual", "timeout", "left_page"];

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as {
            idToken: string;
            answers?: Record<string, string>;
            reason?: string;
        };

        if (!body.idToken) {
            return NextResponse.json(
                { error: "Missing ID token." },
                { status: 401 }
            );
        }

        let uid: string;

        try {
            const decoded = await adminAuth.verifyIdToken(body.idToken);
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
                { error: "No application found." },
                { status: 404 }
            );
        }

        const reason: ExamSubmitReason = VALID_REASONS.includes(
            body.reason as ExamSubmitReason
        )
            ? (body.reason as ExamSubmitReason)
            : "manual";

        const answers = body.answers as ExamAnswerMap | undefined;

        // Idempotent by design: if this exam was already finalized by
        // an earlier request (e.g. a timeout finalize that raced a
        // tab-switch auto-submit), this is a harmless no-op — the
        // applicant still gets a success response either way, since
        // from their point of view the exam is, correctly, over.
        await finalizeExam(ref, answers, reason);

        // Never include the score here — the applicant must not learn
        // their result from this response.
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("edp exam submit error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
