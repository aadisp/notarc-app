"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";

import AuthBackground from "@/components/auth/auth-background";
import AuthCard from "@/components/auth/auth-card";
import AuthInput from "@/components/auth/auth-input";

import { Button } from "@/components/ui/button";

import {
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "sonner";

export default function ResetPasswordPage() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const oobCode =
    searchParams.get("oobCode") ?? "";

  const [validLink, setValidLink] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  useEffect(() => {

    async function verifyCode() {

      try {

        await verifyPasswordResetCode(
          auth,
          oobCode
        );

        setValidLink(true);

      } catch {

        setValidLink(false);

      } finally {

        setChecking(false);

      }

    }

    if (oobCode) {

      verifyCode();

    } else {

      setChecking(false);

    }

  }, [oobCode]);

  async function handleResetPassword() {

    if (password.length < 8) {

      toast.error(
        "Password must be at least 8 characters."
      );

      return;

    }

    if (password !== confirmPassword) {

      toast.error(
        "Passwords do not match."
      );

      return;

    }

    setLoading(true);

    try {

      await confirmPasswordReset(
        auth,
        oobCode,
        password
      );

      toast.success(
        "Password updated successfully."
      );

      setTimeout(() => {

        router.push("/login");

      }, 1500);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to reset password."
      );

    } finally {

      setLoading(false);

    }

  }

  if (checking) {

    return (
      <AuthBackground>
        <AuthCard
          title="Checking Link"
          subtitle="Please wait..."
        />
      </AuthBackground>
    );

  }

  if (!validLink) {

    return (
      <AuthBackground>
        <AuthCard
          title="Invalid Link"
          subtitle="This password reset link is invalid or has expired."
        />
      </AuthBackground>
    );

  }

  return (

    <AuthBackground>

      <AuthCard
        title="Reset Password"
        subtitle="Choose a new password."
      >

        <div className="space-y-5">

          <AuthInput
            icon={<Lock size={18} />}
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            endIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? <Eye size={18} />
                  : <EyeOff size={18} />}
              </button>
            }
          />

          <AuthInput
            icon={<Lock size={18} />}
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            endIcon={
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? <Eye size={18} />
                  : <EyeOff size={18} />}
              </button>
            }
          />

          <Button
            className="w-full h-12"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </Button>

        </div>

      </AuthCard>

    </AuthBackground>

  );

}