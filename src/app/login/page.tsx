"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function LoginPage() {

  const [identifier,
    setIdentifier] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  async function handleLogin() {

    try {

      let loginEmail =
        identifier;

      if (
        !identifier.includes("@")
      ) {

        const userQuery =
          query(
            collection(
              db,
              "users"
            ),
            where(
              "username",
              "==",
              identifier
            )
          );

        const snapshot =
          await getDocs(
            userQuery
          );

console.log(
  "Username search:",
  identifier
);

console.log(
  "Documents found:",
  snapshot.size
);

        if (
          snapshot.empty
        ) {
          alert(
            "Username not found"
          );
          return;
        }

        loginEmail =
          snapshot.docs[0]
            .data().email;
        console.log(
  "Resolved email:",
  loginEmail
);
      }

      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        password
      );

      alert(
        "Logged in!"
      );

    } catch (error) {

      console.error(error);

      alert(
        String(error)
      );
    }
  }

  return (
    <main className="mx-auto max-w-md p-10">

      <h1 className="mb-6 text-4xl font-bold">
        Login
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) =>
            setIdentifier(
              e.target.value
            )
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
          Login
        </button>

      </form>

    </main>
  );
}