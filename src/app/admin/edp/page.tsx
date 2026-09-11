import SiteLayout from "@/components/layout/site-layout";

import EdpApplicationsPage from "@/components/admin/edp/edp-applications-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin • EDP Applications",
};

export default function AdminEdpPage() {
    return (
        <SiteLayout>
            <section className="mx-auto max-w-7xl px-6 py-24">
            <EdpApplicationsPage />
            </section>
        </SiteLayout>
    );
}