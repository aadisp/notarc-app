"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import UploadBox from "@/components/admin/upload-box";
import { uploadToCloudinary } from "@/lib/cloudinary";
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

  const [
    longDescription,
    setLongDescription,
  ] = useState(course.longDescription);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  useEffect(() => {
    setName(course.name);
    setSlug(course.slug);
    setLevel(course.level);
    setDuration(course.duration);
    setDescription(course.description);
    setLongDescription(course.longDescription);
    setNewImage(null);
  }, [course]);

async function handleSave() {

  try {

    let imageUrl = course.imageUrl;
    let publicId = course.publicId;

    if (newImage) {
      const upload = await uploadToCloudinary(newImage);

      imageUrl = upload.imageUrl;
      publicId = upload.publicId;
    }

    await updateDoc(
      doc(db, "courses", course.id),
      {
        name,
        slug,
        level,
        duration,
        description,
        longDescription,
        imageUrl,
        publicId,
      }
    );

    toast.success(
      "Course updated successfully!"
    );

    setNewImage(null);

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

      <DialogContent className="sm:max-w-4xl">

        <DialogHeader>
          <DialogTitle>
            Edit Course
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="space-y-3 lg:max-w-sm">

            {!newImage && (
  course.imageUrl ? (
    <img
      src={course.imageUrl}
      alt={course.name}
      className="h-48 w-full rounded-xl object-cover"
    />
  ) : (
    <div
      className="
        flex
        h-48
        items-center
        justify-center
        rounded-xl
        bg-slate-100
        text-slate-400
      "
    >
      No Image
    </div>
  )
)}

<UploadBox
  file={newImage}
  onChange={setNewImage}
  accent="violet"
  title="Replace Course Image"
/>

          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-5">

            <div className="grid gap-5 md:grid-cols-2">

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Course Name"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Level"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="min-h-36 w-full rounded-xl border p-3"
            />

            <textarea
                value={longDescription}
                onChange={(e) =>
                    setLongDescription(e.target.value)
                }
                placeholder="Long Description"
                className="
                    min-h-60
                    w-full
                    rounded-xl
                    border
                    p-3
                "
            />

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}