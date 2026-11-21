"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";
import SiteLayout from "@/components/layout/site-layout";
import AdminNav from "@/components/admin/admin-nav";
import { db } from "@/firebase/firebase";
import type { RpcEnquiry, RpcEnquiryStatus } from "@/types/rpc-enquiry";

const STATUS_OPTIONS: RpcEnquiryStatus[] = [
  "new",
  "contacted",
  "enrolled",
  "closed",
];

const STATUS_STYLES: Record<RpcEnquiryStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-700",
  enrolled: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-600",
};

export default function RpcEnquiriesPage() {

  const role = useUserRole();

  const [enquiries, setEnquiries] = useState<RpcEnquiry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const q = query(
      collection(db, "rpcEnquiries"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as RpcEnquiry[];

      setEnquiries(list);
    });

    return () => unsubscribe();

  }, []);

  async function handleStatusChange(
    enquiryId: string,
    status: RpcEnquiryStatus
  ) {

    try {
      await updateDoc(doc(db, "rpcEnquiries", enquiryId), { status });
      toast.success("Status updated.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }

  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const text = search.toLowerCase();

    return (
      enquiry.name.toLowerCase().includes(text) ||
      enquiry.email.toLowerCase().includes(text) ||
      enquiry.phone.includes(text)
    );
  });

  if (role !== "admin") {
    return (
      <SiteLayout>
        <section className="p-10">
          Access Denied
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-8 text-5xl font-bold">
          RPC Enquiries
        </h1>

        <AdminNav />

        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="
              w-full
              max-w-md
              rounded-lg
              border
              border-gray-300
              px-4
              py-2.5
              text-sm
              outline-none
              focus:border-gray-900
            "
          />
        </div>

        <div className="space-y-4">

          {filteredEnquiries.length === 0 ? (

            <div className="rounded-2xl border bg-white p-16 text-center shadow-sm">
              <h2 className="text-2xl font-semibold">
                No enquiries found
              </h2>
              <p className="mt-2 text-gray-500">
                RPC enquiries will show up here as students submit them.
              </p>
            </div>

          ) : (

            filteredEnquiries.map((enquiry) => (

              <div
                key={enquiry.id}
                className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold">
                      {enquiry.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {enquiry.email} • {enquiry.phone}
                    </p>

                    <p className="mt-1 text-sm capitalize text-gray-500">
                      Preferred category: {enquiry.preferredCategory}
                    </p>

                    {enquiry.message && (
                      <p className="mt-3 max-w-xl rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        {enquiry.message}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col items-end gap-3">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        capitalize
                        ${STATUS_STYLES[enquiry.status]}
                      `}
                    >
                      {enquiry.status}
                    </span>

                    <select
                      value={enquiry.status}
                      onChange={(e) =>
                        handleStatusChange(
                          enquiry.id,
                          e.target.value as RpcEnquiryStatus
                        )
                      }
                      className="
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-1.5
                        text-sm
                        capitalize
                        outline-none
                        focus:border-gray-900
                      "
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <p className="text-xs text-gray-400">
                      {enquiry.createdAt
                        ?.toDate()
                        .toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                    </p>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </section>
    </SiteLayout>
  );
}
