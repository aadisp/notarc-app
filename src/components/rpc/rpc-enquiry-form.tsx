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
      className="scroll-mt-24 border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 sm:py-28"
    >

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">

        {/* Registration process — a flight-path timeline instead of a
            numbered-circle list */}
        <div>

          <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-600">
            05 — Registration
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Registration Process
          </h2>

          <ol className="relative mt-10 space-y-8 border-l-2 border-slate-300 pl-8">
            {REGISTRATION_STEPS.map((step, index) => (
              <li key={step} className="relative">
                <span
                  className="
                    absolute
                    -left-[37px]
                    top-0.5
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-sky-500
                    bg-slate-50
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                </span>
                <span className="font-mono text-xs text-slate-400">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm leading-6 text-slate-700 sm:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>

        </div>

        {/* Enquiry form — styled as a boarding-pass stub with a
            dashed tear-line across the top */}
        <div className="border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-dashed border-slate-300 px-6 py-3 sm:px-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Boarding Pass
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              RPC Enquiry
            </span>
          </div>

          <div className="p-6 sm:p-8">

            {view.kind === "checking" && (
              <div className="h-80 animate-pulse bg-slate-100" />
            )}

            {view.kind === "submitted" && (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-sky-500" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Enquiry Received
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  Thank you for your interest in the RPC program. Our team
                  will contact you shortly regarding eligibility and next
                  steps.
                </p>
              </div>
            )}

            {view.kind === "form" && (
              <form onSubmit={handleSubmit} className="space-y-4">

                <h3 className="text-lg font-bold text-slate-900">
                  Submit Your RPC Enquiry
                </h3>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    className="
                      w-full
                      rounded-md
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-sky-500
                      focus:ring-2
                      focus:ring-sky-500/20
                    "
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                        rounded-md
                        border
                        border-slate-300
                        bg-white
                        px-3
                        py-2.5
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-500/20
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      className="
                        w-full
                        rounded-md
                        border
                        border-slate-300
                        bg-white
                        px-3
                        py-2.5
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-500/20
                      "
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                          rounded-md
                          border
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          capitalize
                          transition
                          ${
                            form.preferredCategory === category
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                          }
                        `}
                      >
                        {category} Category
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    rows={3}
                    className="
                      w-full
                      rounded-md
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-sky-500
                      focus:ring-2
                      focus:ring-sky-500/20
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
                    rounded-md
                    bg-sky-500
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-sky-500/20
                    transition
                    hover:bg-sky-400
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

      </div>

    </section>
  );
}