"use client";

import { useContacts } from "@/hooks/use-contacts";
import { useState } from "react";

import MessageDialog from "./message-dialog";
import AdminNav from "@/components/admin/admin-nav";

import { ContactMessage } from "@/types/contact";
export default function MessagesPage() {

    const {
        contacts,
        loading,
    } = useContacts();

    const [selected, setSelected] =
        useState<ContactMessage | null>(null);

    const [open, setOpen] =
        useState(false);

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                Loading messages...
            </div>
        );
    }

    return (

        <main className="mx-auto max-w-7xl px-6 py-12">

            <div className="mb-10">

                <h1 className="mb-8 text-5xl font-bold">
                    Contact Messages
                </h1>

                <AdminNav />

                <p className="mt-2 text-muted-foreground">
                    Manage enquiries submitted through the website.
                </p>

            </div>

            <div className="overflow-hidden rounded-2xl border">

                <table className="w-full">

                    <thead className="bg-muted">
                        <tr>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Subject
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {contacts.map((contact) => (

                            <tr
                                key={contact.id}
                                onClick={() => {
                                    setSelected(contact);
                                    setOpen(true);
                                }}
                                className="cursor-pointer border-t hover:bg-muted/50 transition-colors"
                            >

                                <td className="p-4">
                                    {contact.name}
                                </td>

                                <td className="p-4">
                                    {contact.email}
                                </td>

                                <td className="p-4">
                                    {contact.subject}
                                </td>

                                <td className="p-4">

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">

                                        {contact.status}

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <MessageDialog
                open={open}
                onOpenChange={setOpen}
                contact={selected}
            />

        </main>

    );
}