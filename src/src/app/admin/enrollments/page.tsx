import type { Metadata } from "next";
import EnrollmentsPage from "./enrollments-page";

export const metadata: Metadata = {
  title: "Admin • Enrollments | NOTARC",
};

export default function Page() {
  return <EnrollmentsPage />;
}