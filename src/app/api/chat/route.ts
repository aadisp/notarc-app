import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase-admin";
import type { Product } from "@/types/product";
import type { Course } from "@/types/course";
import { SITE_KNOWLEDGE } from "@/lib/site-knowledge";
import { isTestItem } from "@/lib/is-test-item";

async function buildProductCatalogSummary(): Promise<string> {
  try {
    const snapshot = await adminDb.collection("products").get();

    const products = snapshot.docs
      .map((doc) => doc.data() as Product)
      .filter((product) => !isTestItem(product.name));

    if (products.length === 0) {
      return "There are currently no products listed in the store.";
    }

    const categoryCounts = products.reduce<Record<string, number>>(
      (counts, product) => {
        const category = product.category || "Uncategorized";
        counts[category] = (counts[category] || 0) + 1;
        return counts;
      },
      {}
    );

    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([category, count]) => `${category}: ${count}`)
      .join(", ");

    const productList = products
      .map(
        (product) =>
          `- ${product.name} (${product.category}) — ₹${product.price}: ${product.description}`
      )
      .join("\n");

    return `There are currently ${products.length} products for sale, broken down by category as follows: ${categoryBreakdown}.

Full current product list:
${productList}`;

  } catch (error) {
    console.error("Failed to fetch product catalog for chat:", error);
    return "Live product data is temporarily unavailable.";
  }
}

async function buildCourseCatalogSummary(): Promise<string> {
  try {
    const snapshot = await adminDb.collection("courses").get();

    const courses = snapshot.docs
      .map((doc) => doc.data() as Course)
      .filter((course) => !isTestItem(course.name));

    if (courses.length === 0) {
      return "There are currently no courses listed.";
    }

    const courseList = courses
      .map(
        (course) =>
          `- ${course.name} (Level: ${course.level}, Duration: ${course.duration}): ${course.description}`
      )
      .join("\n");

    return `There are currently ${courses.length} courses available.

Full current course list:
${courseList}`;

  } catch (error) {
    console.error("Failed to fetch course catalog for chat:", error);
    return "Live course data is temporarily unavailable.";
  }
}

function buildSystemPrompt(
  productCatalogSummary: string,
  courseCatalogSummary: string
): string {
  return `You are the friendly assistant for Notarc, a company that sells drones, robotics kits, electronic components, and offers courses in drones and robotics for students, makers, and researchers. Keep answers concise and helpful.

Below is everything you know about the website: a description of every publicly-accessible page and its content, plus live, current product and course data. Use all of this to answer visitor questions accurately.

${SITE_KNOWLEDGE}

=== LIVE PRODUCT CATALOG ===
${productCatalogSummary}

=== LIVE COURSE CATALOG ===
${courseCatalogSummary}

If you're asked something not covered above (like a specific order's status, which only the account owner can see, or anything you're genuinely unsure about), say so honestly and suggest the visitor use the Contact Us page or log into their account instead of guessing.`;
}

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as {
      messages: IncomingMessage[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing messages" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chat is not configured yet." },
        { status: 500 }
      );
    }

    const [productCatalogSummary, courseCatalogSummary] =
      await Promise.all([
        buildProductCatalogSummary(),
        buildCourseCatalogSummary(),
      ]);

    const systemPrompt = buildSystemPrompt(
      productCatalogSummary,
      courseCatalogSummary
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          generationConfig: {
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", errorBody);

      return NextResponse.json(
        { error: "Something went wrong talking to the assistant." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const replyText =
      data.candidates?.[0]?.content?.parts
        ?.map((part: { text: string }) => part.text)
        .join("\n") ?? "";

    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error("Chat route error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}