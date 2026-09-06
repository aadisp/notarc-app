import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Curated, hand-picked from the business's existing Google reviews.
// Only complete reviews were included — a handful of others on Google
// were cut short by Google's own "…More" truncation and are left out
// rather than guessing how they end.
const CURATED_REVIEWS: Array<{
  userName: string;
  rating: number;
  text: string;
  daysAgo: number;
}> = [
  {
    userName: "Punith R",
    rating: 5,
    text: "So had this Notarc collaboration at our college Sri Krishna Institution Of Technology, was very useful in learning about drones, knowing how to build a drone from scratch. Was very interesting, thanks to Notarc and Sri Krishna Institution of Technology.",
    daysAgo: 30,
  },
  {
    userName: "Gagana R",
    rating: 5,
    text: "The drone workshop was a great experience. It was well-organized, easy to understand, and the practical session made it even more interesting. The instructors were supportive and explained concepts clearly. Overall, it was a great learning experience.",
    daysAgo: 150,
  },
  {
    userName: "Nanditha Singh",
    rating: 5,
    text: "I had a recent workshop. It was very helpful — I learnt a lot about drones and learnt how to build a drone and fly it. I had great instructors who taught me very efficiently, and I am very happy that I attended this workshop. Thank you.",
    daysAgo: 150,
  },
  {
    userName: "Joash Immanuel J",
    rating: 5,
    text: "Good practical exposure and learning. People involved with drone workshops and internships get hands-on exposure to UAV systems, drone assembly, and real-world applications. It's especially useful for students interested in drones, robotics, and aerospace projects.",
    daysAgo: 90,
  },
  {
    userName: "Swishey",
    rating: 5,
    text: "I was excited about drones, and this was the right spot to learn about them from the very first step to an advanced level. Glad I learnt some great things about drones which will be useful for me — thanks to the Notarc members.",
    daysAgo: 30,
  },
  {
    userName: "Guru Raj",
    rating: 5,
    text: "Good platform for learning and building drones with modern technology.",
    daysAgo: 30,
  },
  {
    userName: "Thrisha Thrish",
    rating: 5,
    text: "Good training provided and best place to gain knowledge!",
    daysAgo: 90,
  },
  {
    userName: "Sneha RT Gowda",
    rating: 5,
    text: "We had the 3-day workshop at SKIT — that day we learnt so many things, it will help for future use.",
    daysAgo: 150,
  },
  {
    userName: "Chandana M",
    rating: 5,
    text: "They provide very good, interesting, and cost-effective projects. Very good teaching at a very affordable price.",
    daysAgo: 365,
  },
  {
    userName: "Sambhram A",
    rating: 5,
    text: "To build your future, join Notarc. Teaching and service is very good. Very good innovators.",
    daysAgo: 365,
  },
];

export async function POST(request: NextRequest) {
  try {

    const sessionCookie =
      request.cookies.get("notarc-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded =
      await adminAuth.verifySessionCookie(sessionCookie);

    const userSnapshot =
      await adminDb
        .collection("users")
        .doc(decoded.uid)
        .get();

    const role = userSnapshot.exists
      ? userSnapshot.data()?.role
      : "user";

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Admins only" },
        { status: 403 }
      );
    }

    const batch = adminDb.batch();
    const now = Date.now();

    for (const review of CURATED_REVIEWS) {

      const ref = adminDb.collection("reviews").doc();

      batch.set(ref, {
        userId: `seed-${ref.id}`,
        userName: review.userName,
        rating: review.rating,
        text: review.text,
        createdAt: Timestamp.fromMillis(
          now - review.daysAgo * 24 * 60 * 60 * 1000
        ),
        seeded: true,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: CURATED_REVIEWS.length,
    });

  } catch (error) {

    console.error("Seed reviews error:", error);

    return NextResponse.json(
      { error: "Failed to seed reviews" },
      { status: 500 }
    );
  }
}