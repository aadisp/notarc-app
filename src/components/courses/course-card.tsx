"use client";

import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useState } from "react";
import Link from "next/link";

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
  const role = useUserRole();

  const [editing, setEditing] =
  useState(false);

  const [editName, setEditName] =
  useState(name);

  const [editLevel, setEditLevel] =
  useState(level);

  const [editDuration,
    setEditDuration] =
    useState(duration);

  const [editDescription,
    setEditDescription] =
    useState(description);

  const [editImageUrl,
    setEditImageUrl] =
    useState(imageUrl || "");

  async function handleDelete() {
    try {
      await deleteDoc(
        doc(
          db,
          "courses",
          firestoreId
        )
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate() {
    try {
        await updateDoc(
        doc(
            db,
            "courses",
            firestoreId
        ),
        {
            name: editName,
            level: editLevel,
            duration: editDuration,
            description:
            editDescription,
            imageUrl:
            editImageUrl,
        }
        );

        setEditing(false);

        window.location.reload();
    } catch (error) {
        console.error(error);
    }
    }
  return (
    <div className="rounded-xl border overflow-hidden">

      <Link href={`/courses/${slug}`}>

        <div className="aspect-[4/3] bg-slate-200">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-6 space-y-3">

          <h3 className="text-xl font-bold">
            {name}
          </h3>

          <p>{level}</p>

          <p>{duration}</p>

          <p>{description}</p>

        </div>

      </Link>

      <div className="p-6 pt-0">

        {editing && (
          <div className="space-y-2 border rounded p-3 mb-4">

            <input
              value={editName}
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />

            <input
              value={editLevel}
              onChange={(e) =>
                setEditLevel(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />

            <input
              value={editDuration}
              onChange={(e) =>
                setEditDuration(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />

            <input
              value={editImageUrl}
              onChange={(e) =>
                setEditImageUrl(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />

            <Button
              onClick={handleUpdate}
            >
              Save Changes
            </Button>

          </div>
        )}

        {role === "admin" && (
          <div className="flex gap-2">

            <Button
              variant="outline"
              onClick={() =>
                setEditing(!editing)
              }
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>

          </div>
        )}

      </div>

    </div>
  );
}