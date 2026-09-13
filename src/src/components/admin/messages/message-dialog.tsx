"use client";

import {
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "@/firebase/firebase";
import { ContactMessage } from "@/types/contact";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact: ContactMessage | null;
}

export default function MessageDialog({
    open,
    onOpenChange,
    contact,
}: Props) {

    useEffect(() => {

        if (!open || !contact) return;

        if (contact.status === "new") {

            updateStatus("read");

        }

    }, [open, contact]);

    if (!contact) return null;


    async function updateStatus(
        status: "new" | "read" | "resolved"
    ) {

        if (!contact) return;

        if (contact.status === status) return;

        await updateDoc(
            doc(db, "contacts", contact.id),
            {
                status,
            }
        );
    }

    async function deleteMessage() {

        if (!contact) return;

        const confirmed = window.confirm(
            "Delete this message permanently?"
        );

        if (!confirmed) return;

        await deleteDoc(
            doc(db, "contacts", contact.id)
        );

        onOpenChange(false);

    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="max-w-2xl">

                <DialogHeader>

                    <DialogTitle>

                        {contact.subject}

                    </DialogTitle>

                </DialogHeader>

                <div className="space-y-5">

                    <div>

                        <p className="font-semibold">
                            Name
                        </p>

                        <p>{contact.name}</p>

                    </div>

                    <div>

                        <p className="font-semibold">
                            Email
                        </p>

                        <p>{contact.email}</p>

                    </div>

                    <div>

                        <p className="font-semibold">
                            Phone
                        </p>

                        <p>{contact.phone}</p>

                    </div>

                    <div>

                        <p className="font-semibold">
                            Message
                        </p>

                        <p className="whitespace-pre-wrap">
                            {contact.message}
                        </p>

                    </div>

                    <div className="flex gap-3">

                        <Button
                            onClick={() =>
                                updateStatus(
                                    contact.status === "read"
                                        ? "new"
                                        : "read"
                                )
                            }
                        >
                            {contact.status === "read"
                                ? "Mark as Unread"
                                : "Mark as Read"}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() =>
                                updateStatus("resolved")
                            }
                        >
                            Mark as Resolved
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={deleteMessage}
                        >
                            Delete
                        </Button>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    );
}