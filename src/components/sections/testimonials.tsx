"use client";

import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/use-reviews";
import StarRating from "@/components/reviews/star-rating";

const PREVIEW_COUNT = 6;

export default function Testimonials() {

    const { reviews, loading } = useReviews();

    const previewReviews = reviews.slice(0, PREVIEW_COUNT);

    return (

        <section className="mx-auto max-w-7xl px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-24">

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

                ) : previewReviews.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-12 text-center">
                        <p className="text-white/60">
                            No reviews yet — be the first to share your experience.
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">

                        {previewReviews.map((review) => (

                            <div
                                key={review.id}
                                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-sm"
                            >

                                <StarRating rating={review.rating} />

                                <p className="mt-4 flex-1 text-sm leading-6 text-white/70">
                                    "{review.text}"
                                </p>

                                <p className="mt-6 text-sm font-semibold text-white">
                                    {review.userName}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

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