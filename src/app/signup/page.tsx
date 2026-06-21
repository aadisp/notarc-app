"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function SignupPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleSignup() {
    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(
          db,
          "users",
          userCredential.user.uid
        ),
        {
          email,
          role: "user",
        }
      );

      alert("Account created!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="mx-auto max-w-md p-10">
      <h1 className="mb-6 text-4xl font-bold">
        Create Account
      </h1>

      <div className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />

        <button
          onClick={handleSignup}
          className="w-full rounded border p-3"
        >
          Create Account
        </button>

      </div>
    </main>
  );
}