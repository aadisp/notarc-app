"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface GalleryCardProps {
    imageUrl: string;
    showDeleteButton?: boolean;
    onDelete?: () => void;
    onClick?: () => void;
}

export default function GalleryCard({
    imageUrl,
    showDeleteButton = false,
    onDelete,
    onClick,
}: GalleryCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative overflow-hidden rounded-xl  bg-muted cursor-pointer"
        >

            <Image
                src={imageUrl}
                alt="Gallery Image"
                width={600}
                height={600}
                className="
                    aspect-square
                    w-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                "
            />

            {showDeleteButton && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                }}
                className="
                    absolute
                    right-3
                    top-3
                    rounded-full
                    bg-red-600
                    p-2
                    text-white
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                "
            >
                <Trash2 className="h-4 w-4" />
            </button>
            )}

        </div>
    );
}