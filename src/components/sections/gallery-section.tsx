"use client";

import { useGallery } from "@/hooks/use-gallery";
import GalleryGrid from "@/components/gallery/gallery-grid";

export default function GallerySection() {
    const {
        images,
        loading,
        error,
    } = useGallery();

    if (loading) {
        return (
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-8 text-4xl font-bold">
                        Gallery
                    </h2>

                    <p>Loading gallery...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-8 text-4xl font-bold">
                        Gallery
                    </h2>

                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            id="gallery"
            className="mx-auto max-w-7xl px-4 pt-6 pb-12 text-white sm:px-6 sm:pb-16 lg:pt-1 lg:pb-24"
        >
            <div className="mx-auto max-w-7xl">

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Gallery
                </h2>

                <p className="mt-2 mb-6 text-sm text-white/60 italic sm:mt-3 sm:mb-8 sm:text-base">
                    Explore moments from our workshops,
                    projects and innovations.
                </p>

                <GalleryGrid
                    images={images}
                />

            </div>
        </section>
    );
}