import BubbleGallery from "@/components/gallery/bubble-gallery";

export default function GallerySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-40">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Gallery
      </h2>

      <BubbleGallery />
    </section>
  );
}