"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { Course } from "@/types/course";

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

export default function EditCourseDialog({
  open,
  onOpenChange,
  course,
}: EditCourseDialogProps) {

  const [name, setName] =
    useState(course.name);

  const [slug, setSlug] =
    useState(course.slug);

  const [level, setLevel] =
    useState(course.level);

  const [duration, setDuration] =
    useState(course.duration);

  const [description, setDescription] =
    useState(course.description);

  useEffect(() => {
    setName(course.name);
    setSlug(course.slug);
    setLevel(course.level);
    setDuration(course.duration);
    setDescription(course.description);
  }, [course]);

async function handleSave() {

  try {

    await updateDoc(
      doc(db, "courses", course.id),
      {
        name,
        slug,
        level,
        duration,
        description,
      }
    );

    toast.success(
      "Course updated successfully!"
    );

    onOpenChange(false);

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to update course."
    );

  }

}

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle>
            Edit Course
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-36 w-full rounded-xl border p-3"
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}