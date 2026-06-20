import SiteLayout from "@/components/layout/site-layout";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (p) => p.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">

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