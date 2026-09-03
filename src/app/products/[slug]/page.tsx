import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import ProductDetailsView from "./product-details-view";
import type { Product } from "@/types/product";
import type { Metadata } from "next";
import { isTestItem } from "@/lib/is-test-item";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {

  const { slug } = await params;

  const snapshot = await getDocs(
    collection(db, "products")
  );

  const products = snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    )
    .filter((item) => !isTestItem(item.name));

  const product = products.find(
    (item) => item.slug === slug
  );

  return {
    title: product
      ? `${product.name}`
      : "Product",
  };
}


export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {

  const { slug } = await params;

  const snapshot =
    await getDocs(
      collection(
        db,
        "products"
      )
    );

  // Test-named products are hidden from this public storefront route
  // entirely (including for admins browsing the live site) — admins
  // manage/preview test data through the admin dashboard instead.
  const products = snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    )
    .filter((item) => !isTestItem(item.name));

  const product = products.find(
    (item) =>
      item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <SiteLayout>
      <ProductDetailsView
        product={product}
        products={products}
      />
    </SiteLayout>
  );
}