"use client";

import { useEdpApplications } from "@/hooks/use-edp-applications";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import EdpApplicationDialog from "./edp-application-dialog";
import AdminNav from "@/components/admin/admin-nav";

import { EdpApplication } from "@/types/edp-application";

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

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                Loading applications...
            </div>
        );
    }

    const filteredApplications = applications.filter((application) => {

        const query = search.toLowerCase();

        return (
            application.name.toLowerCase().includes(query) ||
            application.usn.toLowerCase().includes(query) ||
            application.email.toLowerCase().includes(query) ||
            application.collegeName.toLowerCase().includes(query)
        );

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

                <div className="mt-6">

                    <Input
                        placeholder="Search by name, USN, email or college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

            </div>

            <div className="overflow-hidden rounded-2xl border">

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

                            </tr>

                        ))}

                        {filteredApplications.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
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