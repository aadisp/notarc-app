"use client";

import { useState } from "react";
import { useEdpApplications } from "@/hooks/use-edp-applications";
import { Input } from "@/components/ui/input";
import EdpApplicationDialog from "./edp-application-dialog";
import AdminNav from "@/components/admin/admin-nav";

import { EdpApplication } from "@/types/edp-application";
import { ExamDecision } from "@/types/edp-exam";
import { AUTO_GRADED_MARKS } from "@/lib/edp/exam-config";
import { EXAM_TOTAL_MARKS } from "@/lib/edp/exam-config";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type DecisionFilter = ExamDecision | "all";
function ExamCell({ application }: { application: EdpApplication }) {

    if (application.examStatus === "submitted") {

        if (application.finalScore !== undefined) {
            return (
                <div>
                    <span className="font-semibold">
                        {application.finalScore} / {EXAM_TOTAL_MARKS}
                    </span>
                    <span className="ml-1.5 text-xs text-emerald-600">
                        (Reviewed)
                    </span>
                </div>
            );
        }

        return (
            <div>
                <span className="font-semibold">
                    {application.score ?? 0} / {AUTO_GRADED_MARKS}
                </span>
                <span className="ml-1.5 text-xs text-muted-foreground">
                    (MCQs)
                </span>
            </div>
        );
    }

    if (application.examStatus === "in_progress") {
        return <span className="text-muted-foreground">In Progress</span>;
    }

    return <span className="text-muted-foreground">Not Started</span>;

}

function DecisionBadge({ application }: { application: EdpApplication }) {

    if (application.decision === "selected") {
        return (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Selected
            </span>
        );
    }

    if (application.decision === "rejected") {
        return (
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                Rejected
            </span>
        );
    }

    if (application.examStatus === "submitted") {
        return (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Pending Review
            </span>
        );
    }

    return <span className="text-muted-foreground">—</span>;

}

export default function EdpApplicationsPage() {

    const {
        applications,
        loading,
    } = useEdpApplications();

    const [selected, setSelected] =
        useState<EdpApplication | null>(null);

    const [open, setOpen] =
        useState(false);

    const [search, setSearch] = useState("");

    const [decisionFilter, setDecisionFilter] =
        useState<DecisionFilter>("all");

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                Loading applications...
            </div>
        );
    }

    const filteredApplications = applications.filter((application) => {

        const query = search.toLowerCase();

        const matchesSearch =
            application.name.toLowerCase().includes(query) ||
            application.usn.toLowerCase().includes(query) ||
            application.email.toLowerCase().includes(query) ||
            application.collegeName.toLowerCase().includes(query);

        const applicationDecision: ExamDecision =
            application.decision ?? "pending";

        const matchesDecision =
            decisionFilter === "all" ||
            applicationDecision === decisionFilter;

        return matchesSearch && matchesDecision;

    });

    return (

        <main className="mx-auto max-w-7xl px-6 py-12">

            <div className="mb-10">

                <h1 className="mb-8 text-5xl font-bold">
                    EDP Applications
                </h1>

                <AdminNav />

                <p className="mt-2 text-muted-foreground">
                    Students who have applied for the Ekalavya Drone Program
                    entrance exam.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <Input
                        placeholder="Search by name, USN, email or college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:max-w-sm"
                    />

                    <Select
                        value={decisionFilter}
                        onValueChange={(value) =>
                            setDecisionFilter(value as DecisionFilter)
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Decisions</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

            </div>

            <div className="overflow-x-auto rounded-2xl border">

                <table className="w-full">

                    <thead className="bg-muted">
                        <tr>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                USN
                            </th>

                            <th className="p-4 text-left">
                                College
                            </th>

                            <th className="p-4 text-left">
                                Branch / Sem
                            </th>

                            <th className="p-4 text-left">
                                Phone
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Exam Score
                            </th>

                            <th className="p-4 text-left">
                                Decision
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {filteredApplications.map((application) => (

                            <tr
                                key={application.id}
                                onClick={() => {
                                    setSelected(application);
                                    setOpen(true);
                                }}
                                className="cursor-pointer border-t hover:bg-muted/50 transition-colors"
                            >

                                <td className="p-4">
                                    {application.name}
                                </td>

                                <td className="p-4">
                                    {application.usn}
                                </td>

                                <td className="p-4">
                                    {application.collegeName}
                                </td>

                                <td className="p-4">
                                    {application.branch} / {application.semester}
                                </td>

                                <td className="p-4">
                                    {application.phone}
                                </td>

                                <td className="p-4">
                                    {application.email}
                                </td>

                                <td className="p-4">
                                    <ExamCell application={application} />
                                </td>

                                <td className="p-4">
                                    <DecisionBadge application={application} />
                                </td>

                            </tr>

                        ))}

                        {filteredApplications.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    No applications found.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

            <EdpApplicationDialog
                open={open}
                onOpenChange={setOpen}
                application={selected}
            />

        </main>

    );
}
