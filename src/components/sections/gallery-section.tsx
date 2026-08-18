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
            className="py-20"
        >
            <div className="mx-auto max-w-7xl px-6">

                <h2 className="text-4xl font-bold tracking-tight">
                    Gallery
                </h2>

                <p className="mt-3 mb-8 text-muted-foreground">
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