import type { Metadata } from "next";
import ProductsPage from "./products-page";

export const metadata: Metadata = {
  title: "Admin Products",
};

export default function Page() {
  return <ProductsPage />;
}