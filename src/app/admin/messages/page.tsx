import SiteLayout from "@/components/layout/site-layout";

import MessagesPage from "@/components/admin/messages/messages-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Messages | NOTARC",
};

export default function AdminMessagesPage() {
    return (
        <SiteLayout>
            <section className="mx-auto max-w-7xl px-6 py-24">
            <MessagesPage />
            </section>
        </SiteLayout>
    );
}