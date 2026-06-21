"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "./use-auth";

export function useUserRole() {
  const { user } = useAuth();

  const [role, setRole] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadRole() {
      if (!user) return;

      const snapshot = await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

      if (snapshot.exists()) {
        setRole(
          snapshot.data().role
        );
      }
    }

    loadRole();
  }, [user]);

  return role;
}