"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";

interface ImageViewerProps {
    open: boolean;
    imageUrl: string | null;
    currentIndex: number;
    totalImages: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    showDeleteButton?: boolean;
    onDelete?: () => void;
}

export default function ImageViewer({
    open,
    imageUrl,
    currentIndex,
    totalImages,
    onClose,
    onPrevious,
    onNext,
    showDeleteButton = false,
    onDelete,
}: ImageViewerProps) {

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "Escape":
                    onClose();
                    break;

                case "ArrowLeft":
                    onPrevious();
                    break;

                case "ArrowRight":
                    onNext();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose, onPrevious, onNext]);

    if (!open || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            onClick={onClose}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
                <X className="h-6 w-6" />
            </button>

            {showDeleteButton && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                    }}
                    className="absolute right-20 top-6 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                    aria-label="Delete image"
                >
                    <Trash2 className="h-6 w-6" />
                </button>
            )}
            <div
                className="relative h-[85vh] w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                }}
                className="
                    absolute
                    left-4
                    top-1/2
                    z-10
                    -translate-y-1/2
                    rounded-full
                    bg-black/40
                    p-3
                    text-white
                    transition
                    hover:bg-black/60
                "
            >
                <ChevronLeft className="h-7 w-7" />
            </button>
                <Image
                    src={imageUrl}
                    alt="Gallery Image"
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                    {currentIndex + 1} / {totalImages}
                </div>
            <button
            onClick={(e) => {
                e.stopPropagation();
                onNext();
            }}
            className="
                absolute
                right-4
                top-1/2
                z-10
                -translate-y-1/2
                rounded-full
                bg-black/40
                p-3
                text-white
                transition
                hover:bg-black/60"
            >
            <ChevronRight className="h-7 w-7" />
        </button>
            </div>
        </div>
    );
}