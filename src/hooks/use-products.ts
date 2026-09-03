"use client";

import { useEffect, useMemo, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Product } from "@/types/product";
import { useUserRole } from "./use-user-role";
import { isTestItem } from "@/lib/is-test-item";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const role = useUserRole();

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

    // Test-named products are only visible to admins (who need to see them
    // to manage/delete them); everyone else never sees them at all.
    const visibleProducts = useMemo(() => {
        if (role === "admin") return products;
        return products.filter((product) => !isTestItem(product.name));
    }, [products, role]);

    return {
        products: visibleProducts,
        loading,
        error,
        refreshProducts: fetchProducts,
    };
}