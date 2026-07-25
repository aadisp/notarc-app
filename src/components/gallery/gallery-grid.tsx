"use client";

import { useState } from "react";

import GalleryCard from "./gallery-card";
import { GalleryImage } from "@/types/gallery";

import ImageViewer from "./image-viewer";

interface GalleryGridProps {
    images: GalleryImage[];
    showDeleteButton?: boolean;
    onDelete?: (id: string) => void;
    initialVisible?: number;
}

export default function GalleryGrid({
    images,
    showDeleteButton = false,
    onDelete,
    initialVisible = 8,
}: GalleryGridProps) {

    const [visible, setVisible] = useState(initialVisible);
    function handleCollapse() {
        setVisible(initialVisible);
    }
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const visibleImages = images.slice(0, visible);

    return (
        <>
            <div
                className="
                    grid
                    grid-cols-1
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                "
            >
                {visibleImages.map((image, index) => (
                    <GalleryCard
                        key={image.id}
                        imageUrl={image.imageUrl}
                        showDeleteButton={showDeleteButton}
                        onDelete={() => onDelete?.(image.id)}
                        onClick={() => setSelectedIndex(index)}
                    />
                ))}
            </div>

            {images.length > initialVisible && (
                <div className="mt-10 flex justify-center gap-4">

                    {visible < images.length && (
                        <button
                            onClick={() => setVisible((prev) => prev + 8)}
                            className="
                                rounded-lg
                                bg-primary
                                px-6
                                py-3
                                text-primary-foreground
                                transition
                                hover:opacity-90
                            "
                        >
                            Load More
                        </button>
                    )}

                    {visible > initialVisible && (
                        <button
                            onClick={handleCollapse}
                            className="
                                rounded-lg
                                border
                                px-6
                                py-3
                                transition
                                hover:bg-muted
                            "
                        >
                            Collapse
                        </button>
                    )}

                </div>
            )}
            <ImageViewer
            open={selectedIndex !== null}
            imageUrl={
                selectedIndex !== null
                    ? visibleImages[selectedIndex].imageUrl
                    : null
            }
            currentIndex={selectedIndex ?? 0}
            totalImages={visibleImages.length}
            showDeleteButton={showDeleteButton}
            onClose={() => setSelectedIndex(null)}
            onPrevious={() =>
                setSelectedIndex((prev) =>
                    prev === null
                        ? null
                        : (prev - 1 + visibleImages.length) % visibleImages.length
                )
            }
            onNext={() =>
                setSelectedIndex((prev) =>
                    prev === null
                        ? null
                        : (prev + 1) % visibleImages.length
                )
            }
            onDelete={() => {
                if (selectedIndex !== null) {
                    onDelete?.(visibleImages[selectedIndex].id);
                    setSelectedIndex(null);
                }
            }}
        />
        </>
    );
}