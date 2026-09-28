export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;

  description: string;      // Short description

  longDescription: string;  // Full description

  imageUrls: string[];
  publicIds?: string[];

  // Absent/undefined is treated as in stock, so existing products
  // created before this field existed keep working without a migration.
  inStock?: boolean;
}