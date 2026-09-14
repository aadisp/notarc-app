import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase-admin";
import { getQuestionById } from "@/lib/edp/server/question-bank";
import {
    autoFinalizeIfExpired,
    findApplicationRefByUid,
    sanitizeSingleAnswer,
} from "@/lib/edp/server/exam-store";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as {
            idToken: string;
            questionId: number;
            answer: string;
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

        if (typeof body.questionId !== "number") {
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

        const question = getQuestionById(body.questionId);

        if (!question) {
            return NextResponse.json(
                { error: "Invalid question." },
                { status: 400 }
            );
        }

        // Validated per the question's own type — MCQ must be A/B/C/D,
        // typed must be a non-empty (and length-capped) string.
        const cleanAnswer = sanitizeSingleAnswer(question, body.answer);

        if (cleanAnswer === null) {
            return NextResponse.json(
                { error: "Invalid answer." },
                { status: 400 }
            );
        }

        await ref.update({
            [`examAnswers.${body.questionId}`]: cleanAnswer,
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
