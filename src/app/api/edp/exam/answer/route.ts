import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase-admin";
import {
    autoFinalizeIfExpired,
    findApplicationRefByUid,
} from "@/lib/edp/server/exam-store";

const VALID_OPTIONS = new Set(["A", "B", "C", "D"]);

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as {
            idToken: string;
            questionId: number;
            optionId: string;
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

        if (
            typeof body.questionId !== "number" ||
            !VALID_OPTIONS.has(body.optionId)
        ) {
            return NextResponse.json(
                { error: "Invalid answer." },
                { status: 400 }
            );
        }

        const ref = await findApplicationRefByUid(uid);

        if (!ref) {
            return NextResponse.json(
                { error: "No application found." },
                { status: 404 }
            );
        }

        const snap = await ref.get();
        const data = snap.data();

        if (!data) {
            return NextResponse.json(
                { error: "No application found." },
                { status: 404 }
            );
        }

        const wasFinalized = await autoFinalizeIfExpired(ref, data);

        if (wasFinalized || data.examStatus !== "in_progress") {
            return NextResponse.json(
                {
                    error: "Your exam is no longer in progress.",
                    examEnded: true,
                },
                { status: 409 }
            );
        }

        const questionIds: number[] = data.examQuestionIds ?? [];

        if (!questionIds.includes(body.questionId)) {
            return NextResponse.json(
                { error: "That question isn't part of your exam." },
                { status: 400 }
            );
        }

        await ref.update({
            [`examAnswers.${body.questionId}`]: body.optionId,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("edp exam answer error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
