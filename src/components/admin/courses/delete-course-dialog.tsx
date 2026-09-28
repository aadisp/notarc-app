"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  courseName: string;
}

export default function DeleteCourseDialog({
  open,
  onOpenChange,
  onDelete,
  courseName,
}: DeleteCourseDialogProps) {

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Delete Course
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-3">

          <p className="text-slate-600">

            Are you sure you want to delete

            <span className="font-semibold">
              {" "}
              {courseName}
            </span>

            ?

          </p>

          <p className="text-sm text-red-500">

            This action cannot be undone.

          </p>

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
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}