import ProductCard from "@/components/cards/product-card";
import { products } from "@/data/products";

export default function ProductGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={`₹${product.price}`}
          category={product.category}
          slug={product.slug}
        />
      ))}

    </div>
  );
}