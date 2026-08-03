"use client";

import GalleryGrid from "@/components/gallery/gallery-grid";
import { useGallery } from "@/hooks/use-gallery";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import AdminGuard from "@/components/admin/admin-guard";
import SiteLayout from "@/components/layout/site-layout";
import AdminNav from "@/components/admin/admin-nav";
import { db } from "@/firebase/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import AddGalleryDialog from "@/components/admin/gallery/add-gallery-dialog";
import UploadBox from "@/components/admin/upload-box";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
export default function AdminGalleryPage() {
    const {
    images,
    loading,
    error,
    refreshGallery,
} = useGallery();
async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;

    const image = images.find((img) => img.id === id);

    if (!image) return;

    if (image.publicId) {
        await fetch("/api/gallery/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicId: image.publicId,
            }),
        });
    }

    await deleteDoc(doc(db, "gallery", id));

    await refreshGallery();
}
async function handleUpload() {
    if (!selectedFile || uploading) return;

    setUploading(true);

    try {
        const { imageUrl, publicId } = await uploadToCloudinary(selectedFile);

        await addDoc(collection(db, "gallery"), {
            imageUrl,
            publicId,
            createdAt: serverTimestamp(),
        });

        setSelectedFile(null);
        setDialogOpen(false);

        await refreshGallery();
    } catch (error) {
        console.error(error);
        alert("Failed to upload image.");
    }
    finally {
        setUploading(false);
    }
}
const [dialogOpen, setDialogOpen] = useState(false);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
if (loading) {
    return (
        <main className="mx-auto max-w-7xl space-y-6 p-8">
            Loading gallery...
        </main>
    );
}
if (error) {
    return (
        <main className="mx-auto max-w-7xl space-y-6 p-8">
            {error}
        </main>
    );
}
    return (
        <AdminGuard>
            <SiteLayout>
            <main className="mx-auto max-w-7xl px-6 py-24">
                <div className="mb-12">
                    <h1 className="mb-8 text-5xl font-bold">
                        Gallery
                    </h1>

                    <AdminNav />

                    <p className="mt-3 text-slate-500">
                        Manage gallery images displayed on the website.
                    </p>
                </div>
                <div className="mb-8 flex justify-end">
                    <Button
                        onClick={() => setDialogOpen(true)}
                    >
                        Add Image
                    </Button>
                </div>
                <GalleryGrid
                    images={images}
                    showDeleteButton
                    onDelete={handleDelete}
                />
                <AddGalleryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
    >
        <div className="space-y-6">

            <UploadBox
                file={selectedFile}
                onChange={setSelectedFile}
                            title="Choose a gallery image"
                        />

                        <div className="flex justify-end">
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                            >
                                {uploading ? "Uploading... Might take upto 120 seconds" : "Upload Image"}
                            </Button>
                        </div>

                    </div>
                </AddGalleryDialog>
            </main>
            </SiteLayout>
        </AdminGuard>
    );
}