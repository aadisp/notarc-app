"use client";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { EdpApplication } from "@/types/edp-application";

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
    application: EdpApplication | null;
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="font-semibold">
                {label}
            </p>

            <p>{value}</p>
        </div>
    );
}

export default function EdpApplicationDialog({
    open,
    onOpenChange,
    application,
}: Props) {

    if (!application) return null;

    async function deleteApplication() {

        if (!application) return;

        const confirmed = window.confirm(
            "Delete this application permanently?"
        );

        if (!confirmed) return;

        await deleteDoc(
            doc(db, "edpApplications", application.id)
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

                        {application.name}

                    </DialogTitle>

                </DialogHeader>

                <div className="grid gap-5 sm:grid-cols-2">

                    <Field label="Full Name" value={application.name} />

                    <Field label="USN" value={application.usn} />

                    <Field label="College" value={application.collegeName} />

                    <Field label="Branch" value={application.branch} />

                    <Field label="Section" value={application.section} />

                    <Field
                        label="Semester"
                        value={String(application.semester)}
                    />

                    <Field label="Phone" value={application.phone} />

                    <Field label="Email" value={application.email} />

                    <Field
                        label="Applied On"
                        value={
                            application.createdAt
                                ? application.createdAt
                                      .toDate()
                                      .toLocaleString()
                                : "—"
                        }
                    />

                </div>

                <div className="flex gap-3">

                    <Button
                        variant="destructive"
                        onClick={deleteApplication}
                    >
                        Delete
                    </Button>

                </div>

            </DialogContent>

        </Dialog>
    );
}