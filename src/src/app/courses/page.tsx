import type { Metadata } from "next";
import CoursesPage from "./courses-page";

export const metadata: Metadata = {
  title: "Courses",
};

export default function Page() {
  return <CoursesPage />;
}