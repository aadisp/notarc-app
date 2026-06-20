import { Button } from "@/components/ui/button";
import ProductCard from "@/components/cards/product-card";

export default function ProductsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-40">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
          Explore Products
        </h2>

        <p className="mt-4 text-muted-foreground">
          Discover drones, components, kits, and accessories.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border p-8">
          <ProductCard
            name="Drone Kit Alpha"
            price="₹4,999"
            category="Drone Kit"
          />
        </div>

        <div className="rounded-xl border p-8">
          <ProductCard
            name="Brushless Motor"
            price="₹799"
            category="Motor"
          />
        </div>

        <div className="rounded-xl border p-8">
          <ProductCard
            name="Flight Controller"
            price="₹2,499"
            category="Electronics"
          />
        </div>
      </div>

      <div className="mt-10">
        <Button>
          View All Products
        </Button>
      </div>
    </section>
  );
}