"use client";

import { useEffect, useMemo, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Product } from "@/types/product";
import { useUserRole } from "@/hooks/use-user-role";

export function useProducts() {
    const [rawProducts, setRawProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const role = useUserRole();
    const isAdmin = role === "admin";

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

            setRawProducts(loadedProducts);
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

    // Products named "Test" are for admins to try things out with and
    // shouldn't be visible to regular shoppers. While the role is still
    // resolving (isAdmin is false by default), Test items stay hidden
    // rather than briefly flashing before the check completes.
    const products = useMemo(() => {
        if (isAdmin) return rawProducts;

        return rawProducts.filter(
            (product) => product.name.trim().toLowerCase() !== "test"
        );
    }, [rawProducts, isAdmin]);

    return {
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
    };
}