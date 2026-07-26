import SiteLayout from "@/components/layout/site-layout";

import MessagesPage from "@/components/admin/messages/messages-page";

export default function AdminMessagesPage() {
    return (
        <SiteLayout>
            <section className="mx-auto max-w-7xl px-6 py-24">
            <MessagesPage />
            </section>
        </SiteLayout>
    );
}