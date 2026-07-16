"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function AddProductDialog({
  open,
  onOpenChange,
  children,
}: AddProductDialogProps) {

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
      className="
        w-[95vw]
        max-w-6xl
        max-h-[90vh]
        overflow-y-auto
        p-8
      "
    >

        <DialogHeader>

          <DialogTitle>
            Add Product
          </DialogTitle>

        </DialogHeader>

        {children}

      </DialogContent>

    </Dialog>

  );

}