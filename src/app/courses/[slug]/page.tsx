import type { Metadata } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { Course } from "@/types/course";
import CoursePage from "./course-page";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {

  const { slug } = await params;

  const snapshot = await getDocs(
    collection(db, "courses")
  );

  const courses = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Course)
  );

  const course = courses.find(
    (item) => item.slug === slug
  );

  return {
    title: course
      ? `${course.name}`
      : "Course",
  };
}

export default async function Page({
  params,
}: PageProps) {

  const { slug } = await params;

  return <CoursePage slug={slug} />;

}