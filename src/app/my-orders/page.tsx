import type { Metadata } from "next";
import MyOrdersPage from "./my-orders-page";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function Page() {
  return <MyOrdersPage />;
}