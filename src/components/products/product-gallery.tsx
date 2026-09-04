"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({
    images,
    productName,
}: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const gallery = images ?? [];
    const hasImages = gallery.length > 0;

    return (
        <div className="flex flex-col gap-4 md:flex-row">

            {/* Main Image */}

            <div
                className="
                    order-1
                    md:order-2
                    flex-1
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    sm:p-6
                    md:p-8
                "
            >
                {hasImages ? (
                    <img
                        src={gallery[selectedImage]}
                        alt={productName}
                        className="
                            h-[280px]
                            w-full
                            object-contain
                            sm:h-[380px]
                            md:h-[450px]
                            lg:h-[550px]
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-[280px]
                            flex-col
                            items-center
                            justify-center
                            gap-3
                            text-white/30
                            sm:h-[380px]
                            md:h-[450px]
                            lg:h-[550px]
                        "
                    >
                        <ImageOff className="h-12 w-12" />
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}
            </div>

            {/* Thumbnails — horizontal scroll on mobile, column on desktop */}

            {gallery.length > 1 && (
                <div
                    className="
                        order-2
                        md:order-1
                        flex
                        gap-3
                        overflow-x-auto
                        pb-1
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden
                        md:flex-col
                        md:overflow-visible
                        md:pb-0
                    "
                >
                    {gallery.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            className={`
                                shrink-0
                                overflow-hidden
                                rounded-xl
                                border-2
                                transition

                                ${
                                    selectedImage === index
                                        ? "border-emerald-500"
                                        : "border-white/10 hover:border-white/30"
                                }
                            `}
                        >
                            <img
                                src={image}
                                alt={`${productName} ${index + 1}`}
                                className="
                                    h-16
                                    w-16
                                    object-contain
                                    bg-white/5
                                    p-2
                                    sm:h-20
                                    sm:w-20
                                "
                            />
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}