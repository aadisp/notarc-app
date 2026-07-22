"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

import type { Order } from "@/types/order";

export function useOrders() {

    const [orders, setOrders] =
        useState<Order[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadOrders() {

            const user =
                auth.currentUser;

            if (!user) {
                setLoading(false);
                return;
            }

            try {

                const q = query(
                    collection(db, "orders"),
                    where(
                        "userId",
                        "==",
                        user.uid
                    ),
                    orderBy(
                        "createdAt",
                        "desc"
                    )
                );

                const snapshot =
                    await getDocs(q);

                const data =
                    snapshot.docs.map(
                        (doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })
                    ) as Order[];

                setOrders(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadOrders();

    }, []);

    return {
        orders,
        loading,
    };

}