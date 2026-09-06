"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronUp,
    MessageSquarePlus,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/use-reviews";
import StarRating from "@/components/reviews/star-rating";

const REVIEWS_PER_PAGE = 8;

export default function Testimonials() {

    const { reviews, loading } = useReviews();
    const { user } = useAuth();
    const role = useUserRole();
    const isAdmin = role === "admin";

    const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const visibleReviews = reviews.slice(0, visibleCount);

    const hasMore = visibleCount < reviews.length;
    const isExpanded = visibleCount > REVIEWS_PER_PAGE;

    function handleShowMore() {
        setVisibleCount((count) =>
            Math.min(count + REVIEWS_PER_PAGE, reviews.length)
        );
    }

    function handleCollapse() {
        setVisibleCount(REVIEWS_PER_PAGE);
    }

    async function handleDeleteReview(reviewId: string) {

        const confirmed = window.confirm(
            "Delete this review? This can't be undone."
        );

        if (!confirmed) return;

        setDeletingId(reviewId);

        try {

            await deleteDoc(doc(db, "reviews", reviewId));

            toast.success("Review deleted.");

        } catch (error) {

            console.error(error);
            toast.error("Failed to delete review. Please try again.");

        } finally {

            setDeletingId(null);

        }
    }

    return (

        <section
            id="testimonials"
            className="mx-auto max-w-7xl px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-24"
        >

            <div className="text-center">

                <p className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                    Testimonials
                </p>

                <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
                    What Our Clients Say
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 italic sm:mt-6 sm:text-base sm:leading-7">
                    Read genuine experiences from our students, customers and
                    partners.
                </p>

            </div>

            <div className="mt-8 sm:mt-10">

                {loading ? (

                    <div className="py-12 text-center text-white/40">
                        Loading reviews...
                    </div>

                ) : visibleReviews.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-12 text-center">
                        <p className="text-white/60">
                            No reviews yet — be the first to share your experience.
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">

                        {visibleReviews.map((review) => {

                            const canDelete =
                                isAdmin || review.id === user?.uid;

                            return (

                            <div
                                key={review.id}
                                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-sm"
                            >

                                {canDelete && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={deletingId === review.id}
                                        aria-label="Delete review"
                                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/30 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <StarRating rating={review.rating} />

                                <p className="mt-4 flex-1 text-sm leading-6 text-white/70">
                                    "{review.text}"
                                </p>

                                <p className="mt-6 text-sm font-semibold text-white">
                                    {review.userName}
                                </p>

                            </div>

                            );

                        })}

                    </div>

                )}

            </div>

            {!loading && (hasMore || isExpanded) && (

                <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">

                    {hasMore && (
                        <Button
                            variant="outline"
                            onClick={handleShowMore}
                            className="h-11 gap-2 border-white/25 bg-white/5 px-6 text-white backdrop-blur-md hover:bg-white hover:text-black"
                        >
                            <ChevronDown className="h-4 w-4" />
                            Read More Reviews
                        </Button>
                    )}

                    {isExpanded && (
                        <Button
                            variant="outline"
                            onClick={handleCollapse}
                            className="h-11 gap-2 border-white/25 bg-white/5 px-6 text-white backdrop-blur-md hover:bg-white hover:text-black"
                        >
                            <ChevronUp className="h-4 w-4" />
                            Collapse
                        </Button>
                    )}

                </div>

            )}

            <div className="mt-10 flex justify-center sm:mt-12">

                <Link href="/leave-a-review">
                    <Button
                        variant="outline"
                        className="h-12 gap-2 border-white/25 bg-white/5 px-6 text-white backdrop-blur-md hover:bg-white hover:text-black"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                        Leave a Review
                    </Button>
                </Link>

            </div>

        </section>

    );

}