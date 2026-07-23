"use client";

import AuthInput from "@/components/auth/auth-input";
import { Mail, Lock } from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import AuthBackground from "@/components/auth/auth-background";
import AuthCard from "@/components/auth/auth-card";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function LoginPage() {

  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

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

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const userRef = doc(db, "users", user.uid);

      const snapshot = await getDoc(userRef);

      // First Google login
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          username:
            user.displayName?.replace(/\s+/g, "").toLowerCase() ??
            `user${Date.now()}`,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }

      // Save account locally (same behavior as email login)
      const previousAccounts = JSON.parse(
        localStorage.getItem("notarcAccounts") || "[]"
      );

      const exists = previousAccounts.some(
        (account: any) => account.uid === user.uid
      );

      if (!exists) {
        previousAccounts.push({
          uid: user.uid,
          username:
            snapshot.exists()
              ? snapshot.data().username
              : user.displayName,
          email: user.email,
        });

        localStorage.setItem(
          "notarcAccounts",
          JSON.stringify(previousAccounts)
        );
      }

      localStorage.removeItem("notarcSelectedAccount");

      toast.success("Welcome!");

      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed.");
    }
  }

  return (
    <AuthBackground>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue your engineering journey."
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          {!selectedAccount && (
            <AuthInput
              icon={<Mail size={18} />}
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          )}

          <div className="relative">

            <AuthInput
              icon={<Lock size={18} />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              }
            />

            

          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            Login
          </Button>

          <div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>

  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white/70 px-3 text-muted-foreground">
      Or continue with
    </span>
  </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl"
              onClick={handleGoogleLogin}
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3C29.2 36 26.8 37 24 37c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.6-6.3 7.2l6.3 5.3C39.4 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>

              Continue with Google
            </Button>

    

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create one
            </Link>
          </p>

        </form>
      </AuthCard>
    </AuthBackground>
  );

}