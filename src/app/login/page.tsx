"use client";

import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function LoginPage() {

  const router = useRouter();

  const [identifier,
    setIdentifier] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [selectedAccount,
    setSelectedAccount] =
    useState<any>(null);

  useEffect(() => {

    const account =
      localStorage.getItem(
        "notarcSelectedAccount"
      );

    if (!account) return;

    const parsed =
      JSON.parse(account);

    setSelectedAccount(
      parsed
    );

    setIdentifier(
      parsed.email
    );

  }, []);

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

          toast.error(
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

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );

      localStorage.removeItem(
        "notarcSelectedAccount"
      );

      const userQuery =
        query(
          collection(
            db,
            "users"
          ),
          where(
            "email",
            "==",
            userCredential.user.email
          )
        );

      const userSnapshot =
        await getDocs(
          userQuery
        );

      if (
        !userSnapshot.empty
      ) {

        const userDoc =
          userSnapshot.docs[0];

        const previousAccounts =
          JSON.parse(
            localStorage.getItem(
              "notarcAccounts"
            ) || "[]"
          );

        const exists =
          previousAccounts.some(
            (
              account: {
                uid: string;
              }
            ) =>
              account.uid ===
              userCredential.user.uid
          );

        if (!exists) {

          previousAccounts.push({

            uid:
              userCredential.user.uid,

            username:
              userDoc.data()
                .username,

            email:
              userCredential.user.email,

          });

          localStorage.setItem(
            "notarcAccounts",
            JSON.stringify(
              previousAccounts
            )
          );

        }

      }

      toast.success(
        "Logged in!"
      );

      router.push("/");

    } catch (error) {

      console.error(error);

      toast.error("Login failed. Please check your credentials.");
      console.error(error);

    }

  }

  return (

    <main className="mx-auto max-w-md p-10">

      <h1 className="mb-6 text-4xl font-bold">
        Login
      </h1>

      {selectedAccount && (

        <div
          className="
            mb-6
            flex
            items-center
            gap-4
            rounded-xl
            border
            p-4
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-slate-900
              text-white
              font-bold
            "
          >
            {selectedAccount.username
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="font-semibold">
              {selectedAccount.username}
            </p>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              {selectedAccount.email}
            </p>

          </div>

        </div>

      )}

      <form
        className="space-y-4"
        onSubmit={(e) => {

          e.preventDefault();

          handleLogin();

        }}
      >

        {!selectedAccount && (

          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) =>
              setIdentifier(
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

        )}

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
          Login
        </button>

      </form>

    </main>

  );

}