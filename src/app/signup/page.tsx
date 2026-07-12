"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function SignupPage() {

  const [email,
    setEmail] =
    useState("");

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

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

      alert(
        "Account created!"
      );

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
          className="
            w-full
            rounded
            border
            p-3
          "
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
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

        <div className="relative">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              rounded
              border
              p-3
              pr-12
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-500
              transition
              hover:text-slate-900
            "
          >

            {showPassword ? (

              <EyeOff
                size={18}
              />

            ) : (

              <Eye
                size={18}
              />

            )}

          </button>

        </div>

        <button
          type="submit"
          className="
            w-full
            rounded
            border
            p-3
          "
        >
          Create Account
        </button>

      </form>

    </main>

  );

}