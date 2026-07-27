"use client";

import { useState } from "react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({
    images,
    productName,
}: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const gallery =
        images.length > 0
            ? images
            : ["notarc-app/public/hero/hero1.jpg"];

    return (
        <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
                {gallery.map((image, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`
                            overflow-hidden
                            rounded-xl
                            border-2
                            transition

                            ${
                                selectedImage === index
                                    ? "border-emerald-600"
                                    : "border-slate-200 hover:border-slate-400"
                            }
                        `}
                    >
                        <img
                            src={image}
                            alt={`${productName} ${index + 1}`}
                            className="
                                h-20
                                w-20
                                object-contain
                                bg-white
                                p-2
                            "
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}

            <div
                className="
                    flex-1
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    p-8
                "
            >
                <img
                    src={gallery[selectedImage]}
                    alt={productName}
                    className="
                        h-[550px]
                        w-full
                        object-contain
                    "
                />
            </div>
        </div>
    );
}