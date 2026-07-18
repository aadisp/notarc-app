"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Product } from "@/types/product";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchProducts() {
        try {
            setLoading(true);

            const snapshot = await getDocs(
                collection(db, "products")
            );

            const loadedProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Product, "id">),
            }));

            setProducts(loadedProducts);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
    };
}