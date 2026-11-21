"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { auth } from "@/firebase/firebase";
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

interface FormState {
  name: string;
  phone: string;
  email: string;
  preferredCategory: RpcCategory | "";
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  preferredCategory: "",
  message: "",
};

type View =
  | { kind: "checking" }
  | { kind: "form" }
  | { kind: "submitted" };

export default function RpcEnquiryForm() {

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<View>({ kind: "checking" });

  useEffect(() => {

    let cancelled = false;

    async function loadStatus() {

      const user = auth.currentUser;

      // The RPC layout already gates this whole page behind login, so
      // a missing user here would be unexpected — but fail open to
      // the form rather than get stuck loading.
      if (!user) {
        if (!cancelled) setView({ kind: "form" });
        return;
      }

      // Prefill the email field from the signed-in account.
      setForm((current) => ({
        ...current,
        email: current.email || user.email || "",
      }));

      try {

        const idToken = await user.getIdToken();

        const response = await fetch("/api/rpc/enquiry-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setView({ kind: "form" });
          return;
        }

        setView(data.hasEnquiry ? { kind: "submitted" } : { kind: "form" });

      } catch (error) {
        console.error(error);
        if (!cancelled) setView({ kind: "form" });
      }

    }

    loadStatus();

    return () => {
      cancelled = true;
    };

  }, []);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      PHONE_PATTERN.test(form.phone) &&
      EMAIL_PATTERN.test(form.email) &&
      (form.preferredCategory === "small" ||
        form.preferredCategory === "medium")
    );
  }, [form]);

  async function handleSubmit(event: FormEvent) {

    event.preventDefault();

    if (!isValid || submitting) return;

    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    setSubmitting(true);

    try {

      const idToken = await user.getIdToken();

      const response = await fetch("/api/rpc/submit-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          preferredCategory: form.preferredCategory,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not submit your enquiry.");
        return;
      }

      setView({ kind: "submitted" });
      setForm(EMPTY_FORM);

      toast.success("Your RPC enquiry has been submitted!");

    } catch (error) {

      console.error(error);
      toast.error(
        "Something went wrong submitting your enquiry. Please try again."
      );

    } finally {
      setSubmitting(false);
    }

  }

  return (
    <section
      id="rpc-enquiry"
      className="scroll-mt-24 border-t border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">

        {/* Registration process */}
        <div>

          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            Registration
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
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
                    bg-amber-500
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-6 text-gray-600 sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>

        </div>

        {/* Enquiry form */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">

          {view.kind === "checking" && (
            <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
          )}

          {view.kind === "submitted" && (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-amber-500" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Enquiry Received
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                Thank you for your interest in the RPC program. Our team
                will contact you shortly regarding eligibility and next
                steps.
              </p>
            </div>
          )}

          {view.kind === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">

              <h3 className="text-lg font-bold text-gray-900">
                Submit Your RPC Enquiry
              </h3>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-amber-500
                    focus:ring-2
                    focus:ring-amber-500/20
                  "
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      focus:border-amber-500
                      focus:ring-2
                      focus:ring-amber-500/20
                    "
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      focus:border-amber-500
                      focus:ring-2
                      focus:ring-amber-500/20
                    "
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Preferred Training Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["small", "medium"] as const).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        updateField("preferredCategory", category)
                      }
                      className={`
                        rounded-lg
                        border
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        capitalize
                        transition
                        ${
                          form.preferredCategory === category
                            ? "border-amber-500 bg-amber-500/10 text-amber-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      {category} Category
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Message (optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={3}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-amber-500
                    focus:ring-2
                    focus:ring-amber-500/20
                  "
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-amber-500
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-amber-500/20
                  transition
                  hover:bg-amber-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Submit Enquiry
              </button>

            </form>
          )}

        </div>

      </div>

    </section>
  );
}
