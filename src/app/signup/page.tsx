"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function SignupPage() {
  const [email, setEmail] =
    useState("");

    const [username, setUsername] =
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
          username,
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

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />

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
          type="submit"
          className="w-full rounded border p-3"
        >
          Create Account
        </button>

      </form>
    </main>
  );
}