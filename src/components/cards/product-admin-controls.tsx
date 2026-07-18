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

interface ProductAdminControlsProps {
    firestoreId: string;
    name: string;
    category: string;
    price: string;
    description: string;
    imageUrl?: string;
}

export default function ProductAdminControls({
    firestoreId,
    name,
    category,
    price,
    description,
    imageUrl,
}: ProductAdminControlsProps) {

    const [editing, setEditing] = useState(false);

    const [editName, setEditName] = useState(name);

    const [editCategory, setEditCategory] =
        useState(category);

    const [editPrice, setEditPrice] =
        useState(price.replace(/[^\d]/g, ""));

    const [editDescription, setEditDescription] =
        useState(description);

    const [editImageUrl, setEditImageUrl] =
        useState(imageUrl || "");

    async function handleDelete() {
        try {
            await deleteDoc(
                doc(db, "products", firestoreId)
            );

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleUpdate() {
        try {
            await updateDoc(
                doc(db, "products", firestoreId),
                {
                    name: editName,
                    category: editCategory,
                    price: Number(editPrice),
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
                            Edit Product
                        </DialogTitle>

                        <DialogDescription>
                            Update the product details below and click Save Changes.
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
                            value={editCategory}
                            onChange={(e) =>
                                setEditCategory(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Category"
                        />

                        <input
                            value={editPrice}
                            onChange={(e) =>
                                setEditPrice(e.target.value)
                            }
                            className="w-full rounded border p-2"
                            placeholder="Price"
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