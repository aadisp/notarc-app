// export default function VisionSection() {
//   return (
//     <section className="mx-auto max-w-5xl px-6 py-40 text-center">
//       <h2 className="mb-8 text-5xl font-bold">
//         Our Vision
//       </h2>

//       <p className="text-lg leading-8 text-muted-foreground">
//         To be India’s leading hub for drone innovation and practical tech education, empowering creators to imagine, build, and fly their future.
//       </p>

      
//       <div className="mb-12 flex items-center justify-center gap-5">
//       <div className="h-px w-24 bg-gray-600" />
//       <p className="text-lg leading-8 text-muted-foreground">
//         <br></br><br></br>
//         NOTARC is a cutting-edge drone and robotics startup based in Bengaluru, Karnataka, dedicated to building the <br></br>future of technology through innovation, education, and customization. We specialize in everything from custom-built drones to AI-integrated prototypes, offering powerful tech solutions for individuals, institutions, and industries.
//       </p>
//       <div className="h-px w-24 bg-gray-600" />
//       </div>
//     </section>
//   );
// }

export default function VisionSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-center text-white lg:py-24">

      <div className="mb-12 text-center">

          <p className="font-semibold uppercase tracking-wider text-white">
              About Us
          </p>

          <h2 className="mt-3 text-5xl font-bold">
              Our Vision
          </h2>

      </div>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/65">
        To be India’s leading hub for drone innovation and practical tech
        education, empowering creators to imagine, build, and fly their future.
      </p>

      <div className="mx-auto mt-12 flex max-w-4xl items-center justify-center gap-5">
        <div className="h-px w-16 shrink-0 bg-white/15" />

        <p className="text-base leading-7 text-white/60 lg:text-lg lg:leading-8">
          NOTARC is a cutting-edge drone and robotics startup based in
          Bengaluru, Karnataka, dedicated to building the future of technology
          through innovation, education, and customization. We specialize in
          everything from custom-built drones to AI-integrated prototypes,
          offering powerful tech solutions for individuals, institutions, and
          industries.
        </p>

        <div className="h-px w-16 shrink-0 bg-white/15" />
      </div>

    </section>
  );
}