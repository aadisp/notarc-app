import type { Metadata } from "next";
import OrderSuccessPage from "./order-success-page";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function Page() {
  return <OrderSuccessPage />;
}