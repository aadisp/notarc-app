"use client";

export default function InternshipAbout() {
  return (
    <section
      id="internship-about"
      className="mx-auto max-w-4xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          About the Program
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          From the Classroom
          <br />
          to the Real World.
        </h2>

        <div className="mx-auto mt-6 max-w-xl space-y-4 text-left text-sm leading-7 text-gray-600 sm:text-base">

          <p>
            Internships bridge the gap between classroom learning and
            real-world industry experience. Students gain hands-on skills
            by working on practical projects and real engineering
            challenges.
          </p>

          <p>
            They develop technical knowledge, problem-solving abilities,
            teamwork, and professional skills. A good internship helps
            students become industry-ready and confident for their future
            careers.
          </p>

        </div>

      </div>

    </section>
  );
}