import SiteLayout from "@/components/layout/site-layout";
import HeroSection from "@/components/sections/hero-section";
import ProductsPreview from "@/components/sections/products-preview";
import CoursesPreview from "@/components/sections/courses-preview";
import GallerySection from "@/components/sections/gallery-section";
import VisionSection from "@/components/sections/vision-section";
import ClientsSection from "@/components/sections/clients-section";

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <ProductsPreview />
      <CoursesPreview />
      <GallerySection />
      <ClientsSection />
      <VisionSection />
    </SiteLayout>
  );
}