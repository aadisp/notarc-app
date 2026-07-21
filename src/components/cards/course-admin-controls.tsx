"use client";

import { Button } from "@/components/ui/button";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CourseAdminControlsProps {
    firestoreId: string;
    name: string;
    level: string;
    duration: string;
    description: string;
    imageUrl?: string;
}

export default function CourseAdminControls({
    firestoreId,
    name,
    level,
    duration,
    description,
    imageUrl,
}: CourseAdminControlsProps) {

    const [editing, setEditing] = useState(false);

    const [editName, setEditName] = useState(name);

    const [editLevel, setEditLevel] =
    useState(level);

    const [editDuration, setEditDuration] =
        useState(duration);

    const [editDescription, setEditDescription] =
        useState(description);

    const [editImageUrl, setEditImageUrl] =
        useState(imageUrl || "");

    async function handleDelete() {
        try {
            await deleteDoc(
                doc(db, "courses", firestoreId)
            );

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleUpdate() {
        try {
            await updateDoc(
                doc(db, "courses", firestoreId),
                {
                    name: editName,
                    level: editLevel,
                    duration: editDuration,
                    description: editDescription,
                    imageUrl: editImageUrl,
                }
            );

            setEditing(false);

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
          

            <Dialog open={editing} onOpenChange={setEditing}>

                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Edit
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-xl">

                    <DialogHeader>

                        <DialogTitle>
                            Edit Course
                        </DialogTitle>

                        <DialogDescription>
                            Update the course details below and click Save Changes.
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <input
                            value={editName}
                            onChange={(e) =>
                                setEditName(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Product Name"
                        />

                        <input
                            value={editLevel}
                            onChange={(e) =>
                                setEditLevel(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Level"
                        />

                        <input
                            value={editDuration}
                            onChange={(e) =>
                                setEditDuration(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Duration"
                        />

                        <input
                            value={editImageUrl}
                            onChange={(e) =>
                                setEditImageUrl(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Image URL"
                        />

                        <textarea
                            value={editDescription}
                            onChange={(e) =>
                                setEditDescription(e.target.value)
                            }
                            className="min-h-32 w-full rounded border p-2"
                            placeholder="Description"
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleUpdate}>
                            Save Changes
                        </Button>

                    </DialogFooter>

                </DialogContent>

                </Dialog>

            <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
            >
                Delete
            </Button>
        </>
    );
}