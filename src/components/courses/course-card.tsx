"use client";

import { Clock3, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CourseAdminControls from "@/components/cards/course-admin-controls";

interface CourseCardProps {
    firestoreId: string;
    slug: string;
    name: string;
    level: string;
    duration: string;
    description: string;
    imageUrl?: string;
}

export default function CourseCard({
    firestoreId,
    slug,
    name,
    level,
    duration,
    description,
    imageUrl,
}: CourseCardProps) {

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      <Link href={`/courses/${slug}`}>

        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <GraduationCap className="h-14 w-14" />
            </div>
          )}

        </div>

        <div className="flex flex-1 flex-col p-6">

          <div className="space-y-3">

            <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {level}
            </span>

            <h3 className="line-clamp-2 text-xl font-bold tracking-tight">
              {name}
            </h3>

            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>

          </div>

          <div className="mt-auto pt-6">

            <div className="mb-5 flex items-center gap-2 text-muted-foreground">

              <Clock3 className="h-4 w-4" />

              <span className="text-sm font-medium">
                {duration}
              </span>

            </div>

            <Button className="h-11 w-full font-semibold">
              View Course
            </Button>

          </div>

        </div>

      </Link>

      <div className="border-t p-6">

        <CourseAdminControls
          firestoreId={firestoreId}
          name={name}
          level={level}
          duration={duration}
          description={description}
          imageUrl={imageUrl}
        />

      </div>

    </div>
  );
}