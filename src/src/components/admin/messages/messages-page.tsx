"use client";

import { useContacts } from "@/hooks/use-contacts";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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

    const [search, setSearch] = useState("");

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                Loading messages...
            </div>
        );
    }

    const filteredContacts = contacts.filter((contact) => {

        const query = search.toLowerCase();

        return (
            contact.name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.subject.toLowerCase().includes(query)
        );

    });

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

                <div className="mt-6">

                    <Input
                        placeholder="Search by name, email or subject..."
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

                        {filteredContacts.map((contact) => (

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