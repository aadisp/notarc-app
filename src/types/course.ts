export interface Course {
  id: string;
  name: string;
  slug: string;
  level: string;
  duration: string;

  description: string;       // Short description

  longDescription: string;   // Full description

  imageUrl: string;
  publicId?: string;
}