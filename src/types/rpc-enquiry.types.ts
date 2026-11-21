import { Timestamp } from "firebase/firestore";

export type RpcCategory = "small" | "medium";

// Admin-managed follow-up status — set by an admin as they work the
// enquiry, independent of anything the applicant can change.
export type RpcEnquiryStatus =
  | "new"
  | "contacted"
  | "enrolled"
  | "closed";

export interface RpcEnquiry {
  id: string;

  userId: string;

  name: string;
  phone: string;
  email: string;

  preferredCategory: RpcCategory;
  message?: string;

  status: RpcEnquiryStatus;

  createdAt: Timestamp;
}
