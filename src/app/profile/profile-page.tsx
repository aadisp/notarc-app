"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { toast } from "sonner";
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

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements also pick up the
  // dark theme variables from globals.css.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
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

      toast.success(
        "Profile updated"
      );

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SiteLayout>

      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >

        <section className="mx-auto max-w-2xl px-6 py-24">

          <h1 className="mb-8 text-5xl font-bold">
            Profile
          </h1>

          {loading ? (

            <p className="text-white/60">
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
                    bg-white/5
                    p-3
                    text-white/60
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
                    bg-white/5
                    p-3
                    text-white/60
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
                    bg-transparent
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
                  hover:bg-white/5
                  transition
                "
              >
                Save Username
              </button>

            </div>

          )}

        </section>

      </div>

    </SiteLayout>
  );
}