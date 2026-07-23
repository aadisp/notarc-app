"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useUserRole } from "@/hooks/use-user-role";
import { db } from "@/firebase/firebase";
import UserStats from "@/components/admin/users/user-stats";
import UserSearch from "@/components/admin/users/user-search";
import UserTable from "@/components/admin/users/user-table";
import { getAuth } from "firebase/auth";
import AdminNav from "@/components/admin/admin-nav";

import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import type { User } from "@/types/user";

export default function AdminUsersPage() {

  const role = useUserRole();

  const auth = getAuth();

  const currentUserId =
    auth.currentUser?.uid;

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const totalUsers =
    users.length;

  const adminUsers =
    users.filter(
      (user) => user.role === "admin"
    ).length;

  const regularUsers =
    users.filter(
      (user) => user.role !== "admin"
    ).length;

  useEffect(() => {

    if (role !== "admin")
      return;

    const q =
      query(
        collection(
          db,
          "users"
        )
      );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          const userList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as User[];

          setUsers(userList);
          setLoading(false);

        },
        () => {
          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, [role]);

  const filteredUsers =
    users.filter((user) => {

      const text =
        search.toLowerCase();

      return (

        user.email
          .toLowerCase()
          .includes(text)

        ||

        (user.username ?? "")
          .toLowerCase()
          .includes(text)

        ||

        user.role
          .toLowerCase()
          .includes(text)

      );

    });

  const handleRoleChange = async (
    userId: string,
    role: string
  ) => {

    try {

      await updateDoc(
        doc(db, "users", userId),
        {
          role,
        }
      );

    } catch (error) {

      console.error(
        "Failed to update role:",
        error
      );

    }

  };

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (

    <SiteLayout>

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Users
        </h1>

        <AdminNav />

        <UserStats
          totalUsers={totalUsers}
          adminUsers={adminUsers}
          regularUsers={regularUsers}
        />

        <div className="mb-8">

        <UserSearch
          value={search}
          onChange={setSearch}
        />

      </div>

        {loading ? (

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-10
              text-center
              shadow-sm
            "
          >

            <h2 className="text-2xl font-semibold">
              Loading users...
            </h2>

          </div>

        ) : (

          <UserTable
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            currentUserId={currentUserId}
          />

        )}

      </section>

    </SiteLayout>

  );

}