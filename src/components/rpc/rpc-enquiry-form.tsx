"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { db } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RpcCategory } from "@/types/rpc-enquiry";

const REGISTRATION_STEPS = [
  "Submit your RPC registration enquiry.",
  "Our team contacts you regarding eligibility.",
  "Select your preferred training category.",
  "Receive the course fee and batch details.",
  "Complete the prescribed training and assessment.",
  "Successfully qualified candidates proceed through the official RPC issuance process.",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

export default function RpcEnquiryForm() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredCategory, setPreferredCategory] =
    useState<RpcCategory | "">("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {

    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !preferredCategory) {
      toast.error("Please fill in all fields.", {
        description: "Name, email and a preferred category are required.",
      });
      return;
    }

    if (!PHONE_PATTERN.test(trimmedPhone)) {
      toast.error("Invalid phone number.", {
        description: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      toast.error("Invalid email address.");
      return;
    }

    setIsSubmitting(true);

    try {

      await addDoc(collection(db, "rpcEnquiries"), {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        preferredCategory,
        message: message.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast.success("Your RPC enquiry has been submitted!", {
        description: "Our team will contact you regarding eligibility.",
      });

      setName("");
      setPhone("");
      setEmail("");
      setPreferredCategory("");
      setMessage("");

    } catch (error) {

      console.error(error);
      toast.error("Failed to submit your enquiry.", {
        description: "Please try again in a few moments.",
      });

    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <section
      id="rpc-enquiry"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="grid gap-12 lg:grid-cols-2">

        <div>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Registration Process
          </h2>

          <ol className="mt-8 space-y-5">
            {REGISTRATION_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-6 text-slate-300 sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>

        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">

          <h3 className="text-xl font-bold">
            Submit Your RPC Enquiry
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form below and our team will reach out about
            eligibility and next steps.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Training Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["small", "medium"] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setPreferredCategory(category)}
                    className={`
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      capitalize
                      transition
                      ${
                        preferredCategory === category
                          ? "border-primary bg-primary/10"
                          : "border-input hover:bg-muted"
                      }
                    `}
                  >
                    {category} Category
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Message (optional)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                placeholder="Anything else we should know?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 text-base"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </Button>

          </form>

        </div>

      </div>

    </section>
  );
}