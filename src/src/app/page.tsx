import SiteLayout from "@/components/layout/site-layout";
import HeroSection from "@/components/sections/hero-section";
import ProductsPreview from "@/components/sections/products-preview";
import GallerySection from "@/components/sections/gallery-section";
import VisionSection from "@/components/sections/vision-section";
import ClientsSection from "@/components/sections/clients-section";
import CoreOfferings from "@/components/sections/core-offerings";
import Testimonials from "@/components/sections/testimonials";
import type { Metadata } from "next";
import Starfield from "@/components/sections/starfield";
import ChatWidget from "@/components/shared/chat-widget";

export const metadata: Metadata = {
  title: "NOTARC",
};

export default function Home() {
  return (
    <SiteLayout homePage>

      <HeroSection />

        <div className="relative bg-[#0b0d10]">

          <Starfield />

          <div className="relative z-10">
            <VisionSection />
            <CoreOfferings />
            <ProductsPreview />
            <GallerySection />
            <ClientsSection />
            <Testimonials />
          </div>

        </div>

      <ChatWidget />

    </SiteLayout>
  );
}