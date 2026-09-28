import type { Metadata } from "next";
import MyCoursesPage from "./my-courses-page";

export const metadata: Metadata = {
  title: "My Courses",
};

export default function Page() {
  return <MyCoursesPage />;
}