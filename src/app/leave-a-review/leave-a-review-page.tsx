"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/hooks/use-auth";
import SiteLayout from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function LeaveAReviewPage() {

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements also pick up the
  // dark theme variables from globals.css.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  useEffect(() => {

    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function loadExistingReview() {

      const existing = await getDoc(
        doc(db, "reviews", user!.uid)
      );

      if (existing.exists()) {

        const data = existing.data();

        setRating(data.rating ?? 0);
        setText(data.text ?? "");
        setIsEditing(true);

      }

      setLoadingExisting(false);

    }

    loadExistingReview();

  }, [user, authLoading, router]);

  async function handleSubmit() {

    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    if (text.trim().length === 0) {
      toast.error("Please write a short review.");
      return;
    }

    setSubmitting(true);

    try {

      const userDoc = await getDoc(
        doc(db, "users", auth.currentUser.uid)
      );

      const userName =
        userDoc.data()?.username ||
        auth.currentUser.email?.split("@")[0] ||
        "Anonymous";

      await setDoc(
        doc(db, "reviews", auth.currentUser.uid),
        {
          userId: auth.currentUser.uid,
          userName,
          rating,
          text: text.trim(),
          ...(isEditing ? {} : { createdAt: serverTimestamp() }),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success(
        isEditing
          ? "Your review has been updated!"
          : "Thanks for your review!"
      );

      router.push("/");

    } catch (error) {

      console.error(error);
      toast.error("Something went wrong. Please try again.");

    } finally {

      setSubmitting(false);

    }
  }

  if (authLoading || loadingExisting) {
    return (
      <SiteLayout>
        <div
          className="bg-[#0b0d10] text-white"
          style={{
            "--background": "#0b0d10",
            "--foreground": "#ffffff",
          } as CSSProperties}
        >
          <section className="py-32 text-center text-white/60">
            Loading...
          </section>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">

          <h1 className="text-3xl font-bold sm:text-4xl">
            {isEditing ? "Edit Your Review" : "Leave a Review"}
          </h1>

          <p className="mt-3 text-white/60">
            {isEditing
              ? "Update your rating or your written review below."
              : "Tell us and other customers about your experience with NOTARC."}
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <label className="mb-2 block text-sm font-medium text-white/70">
              Your Rating
            </label>

            <div className="mb-8 flex gap-2">

              {Array.from({ length: 5 }, (_, index) => {

                const value = index + 1;
                const filled = value <= (hoveredRating || rating);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={36}
                      className={
                        filled
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-white/20"
                      }
                    />
                  </button>
                );

              })}

            </div>

            <label
              htmlFor="review-text"
              className="mb-2 block text-sm font-medium text-white/70"
            >
              Your Review
            </label>

            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share details of your experience with our products, courses, or team..."
              className="min-h-36 border-white/15 bg-white/5 text-white placeholder:text-white/40"
            />

            <Button
              className="mt-6 h-12 w-full text-base font-semibold"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : isEditing
                ? "Update Review"
                : "Submit Review"}
            </Button>

          </div>

        </section>
      </div>
    </SiteLayout>
  );
}