"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AuthError } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import AuthBackground from "@/components/auth/auth-background";
import AuthCard from "@/components/auth/auth-card";
import AuthInput from "@/components/auth/auth-input";

import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebase";

export default function SignupPage() {

  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();

  const [email,
    setEmail] =
    useState("");

  const [username,
    setUsername] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

    
  const [loading, setLoading] = useState(false);

  async function handleSignup() {

    setLoading(true);

    if (!username.trim()) {
      toast.error("Please enter a username.");
      setLoading(false);
      return;
    }

   if (!email.trim()) {
      toast.error("Please enter your email.");
      setLoading(false);
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

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
          phone,
          role: "user",
          createdAt: serverTimestamp(),
        }
      );
      toast.success(
        "Welcome to NOTARC!"
      );

      router.push("/");

    } catch (error) {

      const authError =
        error as AuthError;

      switch (authError.code) {

        case "auth/email-already-in-use":
          toast.error(
            "An account with this email already exists."
          );
          break;

        case "auth/invalid-email":
          toast.error(
            "Please enter a valid email."
          );
          break;

        case "auth/weak-password":
          toast.error(
            "Password is too weak."
          );
          break;

        default:
          toast.error(
            "Failed to create account."
          );
      }

      console.error(error);

    } finally {

      setLoading(false);

    }

  }


  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const snapshot =
        await getDoc(userRef);

      if (!snapshot.exists()) {

        await setDoc(
          userRef,
          {
            username:
              user.displayName
                ?.replace(/\s+/g, "")
                .toLowerCase() ??
              `user${Date.now()}`,

            email: user.email,

            phone: "",

            role: "user",

            createdAt:
              serverTimestamp(),
          }
        );

      }

      toast.success(
        "Welcome to NOTARC!"
      );

      router.push("/");

    } catch (error) {

      console.error(error);

      toast.error(
        "Google sign in failed."
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <AuthBackground>
      <AuthCard
        title="Create Account"
        subtitle="Join the NOTARC engineering community."
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >

          <AuthInput
            icon={<User size={18} />}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <AuthInput
            icon={<Mail size={18} />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            icon={
              <span className="text-sm font-bold">
                +91
              </span>
            }
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "")
              )
            }
            maxLength={10}
          />

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
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            }
          />

        <AuthInput
          icon={<Lock size={18} />}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          endIcon={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          }
        />

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
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
            disabled={loading}
            className="h-12 w-full rounded-xl"
            onClick={handleGoogleLogin}
          >

            {loading ? (
              "Signing in..."
            ) : (
              <>
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
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

        </form>
      </AuthCard>
    </AuthBackground>
  );

}