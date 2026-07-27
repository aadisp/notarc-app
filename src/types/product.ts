export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrls: string[];
  publicIds?: string[];
}