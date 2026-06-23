import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
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

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="
              mb-8
              h-96
              w-full
              rounded-xl
              object-cover
            "
          />
        )}

        <h1 className="mb-6 text-5xl font-bold">
          {product.name}
        </h1>

        <p className="mb-4 text-muted-foreground">
          {product.category}
        </p>

        <p className="mb-10">
          {product.description}
        </p>

        <h2 className="text-3xl font-bold">
          ₹{product.price}
        </h2>

      </section>
    </SiteLayout>
  );
}