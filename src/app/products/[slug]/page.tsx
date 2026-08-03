import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
import RelatedProducts from "@/components/products/related-products";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import ProductGallery from "@/components/products/product-gallery";
import { notFound } from "next/navigation";
import ProductInfo from "@/components/products/product-info";
import type { Product } from "@/types/product";
import type { Metadata } from "next";

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

  const products = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Product)
  );

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

  const products = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Product)
  );

  const product = products.find(
    (item) =>
      item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-12 lg:grid-cols-2 items-start">

          <ProductGallery
              images={product.imageUrls}
              productName={product.name}
          />

          <ProductInfo
            id={product.id}
            name={product.name}
            slug={product.slug}
            category={product.category}
            description={product.description}
            longDescription={product.longDescription}
            price={product.price}
        />

        </div>

        <RelatedProducts
            currentProductId={product.id}
            currentCategory={product.category}
            products={products}
        />

      </section>
    </SiteLayout>
  );
}