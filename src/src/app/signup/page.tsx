import type { Metadata } from "next";
import SignupPage from "./signup-page";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function Page() {
  return <SignupPage />;
}