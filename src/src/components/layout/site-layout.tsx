import { ReactNode } from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import HomeFooter from "@/components/layout/home-footer";

interface SiteLayoutProps {
  children: ReactNode;
  homePage?: boolean;
}

export default function SiteLayout({
  children,
  homePage = false,
}: SiteLayoutProps) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      {homePage ? <HomeFooter /> : <Footer />}
    </>
  );
}