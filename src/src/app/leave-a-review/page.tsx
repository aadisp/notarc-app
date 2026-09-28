import type { Metadata } from "next";
import LeaveAReviewPage from "./leave-a-review-page";

export const metadata: Metadata = {
  title: "Leave a Review",
};

export default function Page() {
  return <LeaveAReviewPage />;
}