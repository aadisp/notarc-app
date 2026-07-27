import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";
import ProductGallery from "@/components/products/product-gallery";
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

        <div className="grid gap-12 lg:grid-cols-2 items-start">

          <ProductGallery
              images={product.imageUrls}
              productName={product.name}
          />

          <div>
              <span
                  className="
                      inline-flex
                      rounded-full
                      bg-emerald-100
                      px-3
                      py-1
                      text-sm
                      font-medium
                      text-emerald-700
                  "
              >
                  {product.category}
              </span>

              <h1
                  className="
                      mt-6
                      text-5xl
                      font-extrabold
                      tracking-tight
                  "
              >
                  {product.name}
              </h1>

              <p
                  className="
                      mt-6
                      text-4xl
                      font-bold
                      text-emerald-600
                  "
              >
                  ₹{product.price}
              </p>

              <div
                  className="
                      mt-8
                      rounded-2xl
                      border
                      bg-slate-50
                      p-6
                  "
              >
                  <h2 className="text-lg font-semibold">
                      Description
                  </h2>

                  <p
                      className="
                          mt-3
                          leading-7
                          text-slate-600
                      "
                  >
                      {product.description}
                  </p>
              </div>
          </div>

        </div>

      </section>
    </SiteLayout>
  );
}