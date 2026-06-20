import SiteLayout from "@/components/layout/site-layout";
import PageHeader from "@/components/layout/page-header";
import ProductGrid from "@/components/products/product-grid";
import ProductSearch from "@/components/products/product-search";
import ProductCategories from "@/components/products/product-categories";

export default function ProductsPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <PageHeader
          title="Explore Products"
          description="Drones, components, kits, accessories, and more."
        />
        <ProductSearch />
        <ProductCategories />
        <ProductGrid />
      </section>
    </SiteLayout>
  );
}