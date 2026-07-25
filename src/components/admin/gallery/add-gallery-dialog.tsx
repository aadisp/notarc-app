"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AddGalleryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export default function AddGalleryDialog({
    open,
    onOpenChange,
    children,
}: AddGalleryDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-2xl">

                <DialogHeader>
                    <DialogTitle>
                        Add Gallery Image
                    </DialogTitle>
                </DialogHeader>

                {children}

            </DialogContent>
        </Dialog>
    );
}