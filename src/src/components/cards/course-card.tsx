import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  duration: string;
  level: string;
}

export default function CourseCard({
  title,
  duration,
  level,
}: CourseCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-video bg-slate-200" />

      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {level}
          </p>

          <h3 className="text-xl font-semibold">
            {title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Duration: {duration}
        </p>

        <Button className="w-full">
          View Course
        </Button>
      </div>
    </div>
  );
}