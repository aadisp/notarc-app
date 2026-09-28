"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { GalleryImage } from "@/types/gallery";

export function useGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchGallery() {
        try {
            setLoading(true);

            const snapshot = await getDocs(
                collection(db, "gallery")
            );

            const loadedImages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<GalleryImage, "id">),
            }));

            setImages(loadedImages);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load gallery.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGallery();
    }, []);

    return {
        images,
        loading,
        error,
        refreshGallery: fetchGallery,
    };
}