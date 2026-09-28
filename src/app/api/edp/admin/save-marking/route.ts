import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken, applicationId, marking } = (await request.json()) as {
      idToken: string;
      applicationId: string;
      marking: Record<string, "right" | "wrong">;
    };

    if (!idToken || !applicationId || !marking) {
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

    const userSnap = await adminDb.collection("users").doc(uid).get();
    const role = userSnap.exists ? userSnap.data()?.role : null;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    const appRef = adminDb.collection("edpApplications").doc(applicationId);
    const appSnap = await appRef.get();

    if (!appSnap.exists) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const data = appSnap.data()!;
    const questionIds: number[] = data.examQuestionIds ?? [];
    const validIds = new Set(questionIds.map(String));

    // Only accept markings for questions that were actually assigned to
    // this applicant — never trust arbitrary keys from the client.
    const cleanedMarking: Record<string, "right" | "wrong"> = {};

    for (const [key, value] of Object.entries(marking)) {
      if (
        validIds.has(key) &&
        (value === "right" || value === "wrong")
      ) {
        cleanedMarking[key] = value;
      }
    }

    const finalScore = Object.values(cleanedMarking).filter(
      (v) => v === "right"
    ).length;

    await appRef.update({
      examMarking: cleanedMarking,
      finalScore,
      markedBy: uid,
    });

    return NextResponse.json({ success: true, finalScore });
  } catch (error) {
    console.error("edp save-marking error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}