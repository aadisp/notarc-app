"use client";

import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/firebase/firebase";
import { EdpApplication } from "@/types/edp-application";
import { ExamDecision, ExamSubmitReason } from "@/types/edp-exam";
import { AUTO_GRADED_MARKS } from "@/lib/edp/exam-config";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import EdpAnswerSheet from "./edp-answer-sheet";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

const REASON_LABELS: Record<ExamSubmitReason, string> = {
    manual: "Submitted manually",
    timeout: "Time ran out",
    left_page: "Left the exam page",
};

function ExamSummary({ application }: { application: EdpApplication }) {

    if (!application.examStatus || application.examStatus === "not_started") {
        return (
            <p className="text-sm text-muted-foreground">
                Hasn&apos;t started the exam yet.
            </p>
        );
    }

    if (application.examStatus === "in_progress") {
        return (
            <p className="text-sm text-muted-foreground">
                Exam is currently in progress.
            </p>
        );
    }

    return (
        <div className="space-y-1.5 text-sm">

            <p>
                <span className="font-semibold">Auto-graded score (MCQs): </span>
                {application.score ?? 0} / {AUTO_GRADED_MARKS}
            </p>

            <p className="text-muted-foreground">
                10 typed short-answer responses are not auto-graded and
                still need your review.
            </p>

            <p>
                <span className="font-semibold">Submitted: </span>
                {application.examSubmittedAt
                    ? application.examSubmittedAt.toDate().toLocaleString()
                    : "—"}
            </p>

            <p>
                <span className="font-semibold">Ended because: </span>
                {application.examSubmitReason
                    ? REASON_LABELS[application.examSubmitReason]
                    : "—"}
            </p>

        </div>
    );

}

export default function EdpApplicationDialog({
    open,
    onOpenChange,
    application,
}: Props) {

    const [savingDecision, setSavingDecision] = useState(false);
    const [answerSheetOpen, setAnswerSheetOpen] = useState(false);

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

    async function updateDecision(decision: ExamDecision) {

        if (!application) return;

        setSavingDecision(true);

        try {

            await updateDoc(
                doc(db, "edpApplications", application.id),
                { decision }
            );

            toast.success(
                decision === "pending"
                    ? "Marked as pending."
                    : `Marked as ${decision}.`
            );

        } catch (error) {

            console.error(error);
            toast.error("Could not update the decision. Please try again.");

        } finally {
            setSavingDecision(false);
        }

    }

    return (

        <>

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

                <div className="rounded-xl border p-4">

                    <p className="mb-3 font-semibold">
                        Exam Result
                    </p>

                    <ExamSummary application={application} />

                </div>

                {application.examStatus === "submitted" && (
                    <Button
                        variant="outline"
                        onClick={() => setAnswerSheetOpen(true)}
                        className="w-full"
                    >
                        View Answer Sheet
                    </Button>
                )}

                <div className="rounded-xl border p-4">

                    <p className="mb-3 font-semibold">
                        Decision
                    </p>

                    <Select
                        value={application.decision ?? "pending"}
                        onValueChange={(value) =>
                            updateDecision(value as ExamDecision)
                        }
                        disabled={savingDecision}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <p className="mt-2 text-xs text-muted-foreground">
                        The applicant sees this decision the next time they
                        open the EDP page.
                    </p>

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

        <EdpAnswerSheet
            applicationId={application.id}
            open={answerSheetOpen}
            onOpenChange={setAnswerSheetOpen}
        />

        </>
    );
}