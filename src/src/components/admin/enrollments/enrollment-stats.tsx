interface EnrollmentStatsProps {
  totalEnrollments: number;
  uniqueStudents: number;
  uniqueCourses: number;
}

export default function EnrollmentStats({
  totalEnrollments,
  uniqueStudents,
  uniqueCourses,
}: EnrollmentStatsProps) {
  const cards = [
    {
      title: "Total Enrollments",
      value: totalEnrollments,
    },
    {
      title: "Students",
      value: uniqueStudents,
    },
    {
      title: "Courses",
      value: uniqueCourses,
    },
  ];

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}