"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Logged in!");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <main className="mx-auto max-w-md p-10">
      <h1 className="mb-6 text-4xl font-bold">
        Login
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
          onClick={handleLogin}
          className="w-full rounded border p-3"
        >
          Login
        </button>

      </div>
    </main>
  );
}