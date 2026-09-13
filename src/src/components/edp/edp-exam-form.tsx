"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { auth } from "@/firebase/firebase";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;
const USN_PATTERN = /^\d[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{3}$/;

function toTitleCase(value: string): string {
    return value.replace(
        /\w\S*/g,
        (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
    );
}

interface FormState {
    name: string;
    usn: string;
    collegeName: string;
    branch: string;
    section: string;
    semester: string;
    phone: string;
    email: string;
}

const EMPTY_FORM: FormState = {
    name: "",
    usn: "",
    collegeName: "",
    branch: "",
    section: "",
    semester: "",
    phone: "",
    email: "",
};

export default function EdpExamForm() {

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {

        let cancelled = false;

        async function checkExistingApplication() {

            const user = auth.currentUser;

            // The EDP layout already gates this whole page behind login,
            // so a missing user here would be unexpected — but fail
            // closed (show the form) rather than get stuck loading.
            if (!user) {
                setCheckingStatus(false);
                return;
            }

            try {

                const idToken = await user.getIdToken();

                const response = await fetch(
                    "/api/edp/application-status",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idToken }),
                    }
                );

                const data = await response.json();

                if (!cancelled && response.ok && data.hasApplied) {
                    setSubmitted(true);
                }

            } catch (error) {
                console.error(error);
            } finally {
                if (!cancelled) {
                    setCheckingStatus(false);
                }
            }

        }

        checkExistingApplication();

        return () => {
            cancelled = true;
        };

    }, []);

    function updateField<K extends keyof FormState>(
        key: K,
        value: string
    ) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    const isValid = useMemo(() => {
        return (
            form.name.trim().length > 0 &&
            USN_PATTERN.test(form.usn.trim()) &&
            form.collegeName.trim().length > 0 &&
            form.branch.trim().length > 0 &&
            form.section.trim().length > 0 &&
            form.semester.trim().length > 0 &&
            PHONE_PATTERN.test(form.phone) &&
            EMAIL_PATTERN.test(form.email)
        );
    }, [form]);

    async function handleSubmit(event: React.FormEvent) {

        event.preventDefault();

        if (!isValid || submitting) return;

        const user = auth.currentUser;

        if (!user) {
            toast.error("Please login first.");
            return;
        }

        setSubmitting(true);

        try {

            // The duplicate checks (one per account, one per USN) and
            // the actual write all happen server-side — the client-facing
            // Firestore rules only allow admins to read edpApplications,
            // so a regular student's browser can't perform those checks
            // itself. An ID token proves who's submitting without
            // trusting a client-supplied user id.
            const idToken = await user.getIdToken();

            const response = await fetch(
                "/api/edp/submit-application",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idToken,
                        name: form.name.trim(),
                        usn: form.usn.trim(),
                        collegeName: form.collegeName.trim(),
                        branch: form.branch.trim(),
                        section: form.section.trim(),
                        semester: Number(form.semester),
                        phone: form.phone,
                        email: form.email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.error || "Could not submit your application."
                );
                return;
            }

            setSubmitted(true);
            setForm(EMPTY_FORM);

            toast.success("Your application has been submitted!");

        } catch (error) {

            console.error(error);

            toast.error(
                "Something went wrong submitting your application. Please try again."
            );

        } finally {
            setSubmitting(false);
        }

    }

    if (checkingStatus) {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
            >
                <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            </section>
        );
    }

    if (submitted) {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 text-center sm:px-6 sm:py-24"
            >

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-10">

                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />

                    <h2 className="mt-4 text-2xl font-bold text-white">
                        Application Submitted
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        Thank you for applying to the Ekalavya Drone Program.
                        We&apos;ll be in touch with next steps for the entrance
                        exam soon.
                    </p>

                    <p className="mt-2 text-xs text-white/40">
                        Only one application is allowed per account.
                    </p>

                </div>

            </section>
        );
    }

    return (
        <section
            id="edp-exam-form"
            className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
        >

            <div className="mb-8 text-center">

                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                    Entrance Exam
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                    Apply for EDP
                </h2>

                <p className="mt-3 text-sm text-white/60">
                    Fill in your details below to register for the EDP entrance
                    exam.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
            >

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Full Name
                    </label>
                    <input
                        required
                        value={form.name}
                        onChange={(e) =>
                            updateField("name", toTitleCase(e.target.value))
                        }
                        placeholder="Jane Doe"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        USN
                    </label>
                    <input
                        required
                        value={form.usn}
                        onChange={(e) => updateField("usn", e.target.value)}
                        placeholder="1XX21XX000"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm uppercase text-white placeholder:text-white/30 placeholder:normal-case focus:border-amber-400/50 focus:outline-none"
                    />
                    {form.usn.length > 0 && !USN_PATTERN.test(form.usn.trim()) && (
                        <p className="mt-1 text-xs text-red-400">
                            Enter a valid USN (e.g. 1MS21CS001).
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        College Name
                    </label>
                    <input
                        required
                        value={form.collegeName}
                        onChange={(e) =>
                            updateField("collegeName", e.target.value)
                        }
                        placeholder="Your college name"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                            Branch
                        </label>
                        <input
                            required
                            value={form.branch}
                            onChange={(e) =>
                                updateField("branch", e.target.value)
                            }
                            placeholder="CSE"
                            className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                            Section
                        </label>
                        <input
                            required
                            value={form.section}
                            onChange={(e) =>
                                updateField("section", e.target.value)
                            }
                            placeholder="A"
                            className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm uppercase text-white placeholder:text-white/30 placeholder:normal-case focus:border-amber-400/50 focus:outline-none"
                        />
                    </div>

                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Semester
                    </label>
                    <select
                        required
                        value={form.semester}
                        onChange={(e) =>
                            updateField("semester", e.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white focus:border-amber-400/50 focus:outline-none [&>option]:bg-[#12151a]"
                    >
                        <option value="" disabled>
                            Select semester
                        </option>
                        {SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>
                                Semester {sem}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Phone Number
                    </label>
                    <input
                        required
                        inputMode="numeric"
                        value={form.phone}
                        onChange={(e) =>
                            updateField(
                                "phone",
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                            )
                        }
                        placeholder="10-digit mobile number"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                    />
                    {form.phone.length > 0 && !PHONE_PATTERN.test(form.phone) && (
                        <p className="mt-1 text-xs text-red-400">
                            Phone number must be exactly 10 digits.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                    />
                    {form.email.length > 0 && !EMAIL_PATTERN.test(form.email) && (
                        <p className="mt-1 text-xs text-red-400">
                            Enter a valid email address.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isValid || submitting}
                    className="
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-amber-400
                        text-sm
                        font-bold
                        text-black
                        transition
                        hover:bg-amber-300
                        disabled:cursor-not-allowed
                        disabled:bg-white/10
                        disabled:text-white/30
                    "
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? "Submitting..." : "Submit Application"}
                </button>

            </form>

        </section>
    );
}