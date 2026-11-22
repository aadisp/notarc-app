import type { Metadata } from "next";
import SiteLayout from "@/components/layout/site-layout";
import RpcHero from "@/components/rpc/rpc-hero";
import RpcAbout from "@/components/rpc/rpc-about";
import RpcCategories from "@/components/rpc/rpc-categories";
import RpcPartners from "@/components/rpc/rpc-partners";
import RpcProgramme from "@/components/rpc/rpc-programme";
import RpcEnquiryForm from "@/components/rpc/rpc-enquiry-form";

export const metadata: Metadata = {
  title: "RPC — Remote Pilot Certificate | Notarc",
};

export default function RpcPage() {
  return (
    <SiteLayout>
      <RpcHero />
      <RpcAbout />
      <RpcCategories />
      <RpcPartners />
      <RpcProgramme />
      <RpcEnquiryForm />
    </SiteLayout>
  );
}
