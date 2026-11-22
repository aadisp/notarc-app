import type { Metadata } from "next";
import RpcEnquiriesPage from "@/components/admin/rpc/rpc-enquiries-page";

export const metadata: Metadata = {
  title: "Admin • RPC Enquiries",
};

export default function AdminRpcPage() {
  return <RpcEnquiriesPage />;
}