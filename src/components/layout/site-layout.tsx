import { ReactNode } from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import AdminFab from "@/components/admin/admin-fab";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({
  children,
}: SiteLayoutProps) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <AdminFab />
    </>
  );
}