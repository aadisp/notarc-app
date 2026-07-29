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
}