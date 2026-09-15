import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { getQuestionById } from "@/lib/edp/server/question-bank";
import type { ExamAnswerMap } from "@/types/edp-exam";

export interface AnswerSheetEntry {
  id: number;
  section: "A" | "B";
  type: "typed" | "mcq";
  prompt: string;
  givenAnswer: string | null;
  marking: "right" | "wrong" | null;

  // Only present for MCQ questions.
  options?: { id: "A" | "B" | "C" | "D"; text: string }[];
  correctOptionId?: "A" | "B" | "C" | "D";
  isCorrect?: boolean;

  // Only present for typed (Section A) questions — a reference answer
  // for the admin to compare against while manually reviewing, since
  // these are not auto-graded.
  correctAnswer?: string; // sourced from the bank's expectedAnswer field
}

export async function POST(request: NextRequest) {
  try {
    const { idToken, applicationId } = (await request.json()) as {
      idToken: string;
      applicationId: string;
    };

    if (!idToken || !applicationId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
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

    // This route returns the actual answer key, so admin status is
    // mandatory here, not optional — never trust a role claimed by the
    // client itself.
    const userSnap = await adminDb.collection("users").doc(uid).get();
    const role = userSnap.exists ? userSnap.data()?.role : null;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    const appSnap = await adminDb
      .collection("edpApplications")
      .doc(applicationId)
      .get();

    if (!appSnap.exists) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const data = appSnap.data()!;

    const questionIds: number[] = data.examQuestionIds ?? [];
    const answers: ExamAnswerMap = data.examAnswers ?? {};
    const existingMarking: Record<string, "right" | "wrong"> =
      data.examMarking ?? {};

    const answerSheet: AnswerSheetEntry[] = questionIds.map((id) => {
      const question = getQuestionById(id);

      if (!question) {
        return {
          id,
          section: "A",
          type: "typed",
          prompt: "(Question no longer exists in the question bank)",
          givenAnswer: answers[String(id)] ?? null,
          marking: null,
        };
      }

      const given = answers[String(id)] ?? null;

      if (question.type === "mcq") {
        const isCorrect = given === question.correctOptionId;

        return {
          id: question.id,
          section: question.section,
          type: "mcq",
          prompt: question.prompt,
          options: question.options,
          correctOptionId: question.correctOptionId,
          givenAnswer: given,
          isCorrect,
          marking:
            existingMarking[String(id)] ??
            (isCorrect ? "right" : "wrong"),
        };
      }

      return {
        id: question.id,
        section: question.section,
        type: "typed",
        prompt: question.prompt,
        correctAnswer: question.expectedAnswer,
        givenAnswer: given,
        marking: existingMarking[String(id)] ?? null,
      };
    });

    return NextResponse.json({
      answerSheet,
      finalScore: data.finalScore ?? null,
    });
  } catch (error) {
    console.error("edp answer-sheet error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}