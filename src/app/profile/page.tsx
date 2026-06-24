"use client";

import { useEffect, useState } from "react";

import { auth, db } from "@/firebase/firebase";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import SiteLayout from "@/components/layout/site-layout";

export default function ProfilePage() {

  const [username,
    setUsername] =
    useState("");

  const [role,
    setRole] =
    useState("");

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {

          if (!user) {
            setLoading(false);
            return;
          }

          const userDoc =
            await getDoc(
              doc(
                db,
                "users",
                user.uid
              )
            );

          if (
            userDoc.exists()
          ) {

            setUsername(
              userDoc.data()
                .username || ""
            );

            setRole(
              userDoc.data()
                .role || ""
            );
          }

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  async function saveProfile() {

    const user =
      auth.currentUser;

    if (!user) return;

    try {

      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          username,
        }
      );

      alert(
        "Profile updated"
      );

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SiteLayout>

      <section className="mx-auto max-w-2xl px-6 py-24">

        <h1 className="mb-8 text-5xl font-bold">
          Profile
        </h1>

        {loading ? (

          <p>
            Loading...
          </p>

        ) : (

          <div className="space-y-6">

            <div>
              <p className="mb-2 font-semibold">
                Email
              </p>

              <input
                value={
                  auth.currentUser
                    ?.email || ""
                }
                disabled
                className="
                  w-full
                  rounded
                  border
                  bg-slate-100
                  p-3
                "
              />
            </div>

            <div>
              <p className="mb-2 font-semibold">
                Role
              </p>

              <input
                value={role}
                disabled
                className="
                  w-full
                  rounded
                  border
                  bg-slate-100
                  p-3
                "
              />
            </div>

            <div>
              <p className="mb-2 font-semibold">
                Username
              </p>

              <input
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-3
                "
              />
            </div>

            <button
              onClick={
                saveProfile
              }
              className="
                rounded
                border
                p-3
              "
            >
              Save Username
            </button>

          </div>

        )}

      </section>

    </SiteLayout>
  );
}