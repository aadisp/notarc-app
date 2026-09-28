import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;
const USN_PATTERN = /^\d[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{3}$/;

interface ApplicationInput {
  idToken: string;
  name: string;
  usn: string;
  collegeName: string;
  branch: string;
  section: string;
  semester: number;
  phone: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ApplicationInput;

    if (!body.idToken) {
      return NextResponse.json(
        { error: "You must be logged in to apply." },
        { status: 401 }
      );
    }

    // Verify the visitor is who they claim to be — never trust a
    // client-supplied userId directly.
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

    // Server-side validation, independent of whatever the client's own
    // form validation already checked — never trust the client alone.
    const name = (body.name ?? "").trim();
    const collegeName = (body.collegeName ?? "").trim();
    const branch = (body.branch ?? "").trim();
    const section = (body.section ?? "").trim().toUpperCase();
    const semester = Number(body.semester);
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const usnKey = (body.usn ?? "").trim().toUpperCase();

    if (
      !name ||
      !collegeName ||
      !branch ||
      !section ||
      !Number.isInteger(semester) ||
      semester < 1 ||
      semester > 8
    ) {
      return NextResponse.json(
        { error: "Please fill in all fields correctly." },
        { status: 400 }
      );
    }

    if (!USN_PATTERN.test(usnKey)) {
      return NextResponse.json(
        { error: "Enter a valid USN (e.g. 1MS21CS001)." },
        { status: 400 }
      );
    }

    if (!PHONE_PATTERN.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    // One application per account.
    const existingByAccount = await adminDb
      .collection("edpApplications")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (!existingByAccount.empty) {
      return NextResponse.json(
        {
          error:
            "You've already submitted an application from this account.",
        },
        { status: 409 }
      );
    }

    // One application per USN — the USN itself is the document id, and
    // the check-then-write happens inside a transaction so it's atomic
    // even if two submissions for the same USN land at the same
    // instant (e.g. from two different accounts).
    try {
      await adminDb.runTransaction(async (transaction) => {
        const usnRef = adminDb
          .collection("edpApplications")
          .doc(usnKey);

        const usnSnap = await transaction.get(usnRef);

        if (usnSnap.exists) {
          throw new Error("DUPLICATE_USN");
        }

        transaction.set(usnRef, {
          userId: uid,
          name,
          usn: usnKey,
          collegeName,
          branch,
          section,
          semester,
          phone,
          email,
          createdAt: FieldValue.serverTimestamp(),
        });
      });
    } catch (error) {
      if (error instanceof Error && error.message === "DUPLICATE_USN") {
        return NextResponse.json(
          {
            error:
              "An application with this USN has already been submitted.",
          },
          { status: 409 }
        );
      }

      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("edp submit-application error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}