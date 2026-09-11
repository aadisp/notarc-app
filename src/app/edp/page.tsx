import type { Metadata } from "next";
import EdpPage from "./edp-page";

export const metadata: Metadata = {
  title: "EDP",
};

export default function Page() {
  return <EdpPage />;
}