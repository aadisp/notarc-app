import type { Metadata } from "next";
import GalleryPage from "./gallery-page";

export const metadata: Metadata = {
  title: "Admin • Gallery",
};

export default function Page() {
  return <GalleryPage />;
}