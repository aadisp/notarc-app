"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CheckCircle2,
    Hourglass,
    Loader2,
    PlayCircle,
    XCircle,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import { ExamStatePayload, ExamStatus } from "@/types/edp-exam";
import EdpExamInstructionsDialog from "@/components/edp/edp-exam-instructions-dialog";

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

// What this component renders after the initial state check resolves.
// "form" is the only view where the applicant hasn't applied yet —
// every other view replaces the form permanently, same as before.
type View =
    | { kind: "checking" }
    | { kind: "form" }
    | { kind: "exam-gate"; examStatus: Extract<ExamStatus, "not_started" | "in_progress"> }
    | { kind: "awaiting-result" }
    | { kind: "decided"; decision: "selected" | "rejected" };

export default function EdpExamForm() {

    const router = useRouter();

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [view, setView] = useState<View>({ kind: "checking" });
    const [instructionsOpen, setInstructionsOpen] = useState(false);

    useEffect(() => {

        let cancelled = false;

        async function loadExamState() {

            const user = auth.currentUser;

            // The EDP layout already gates this whole page behind login,
            // so a missing user here would be unexpected — but fail
            // closed (show the form) rather than get stuck loading.
            if (!user) {
                if (!cancelled) setView({ kind: "form" });
                return;
            }

            try {

                const idToken = await user.getIdToken();

                const response = await fetch("/api/edp/exam/state", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                const data = (await response.json()) as
                    | ExamStatePayload
                    | { error: string };

                if (cancelled) return;

                if (!response.ok || "error" in data) {
                    setView({ kind: "form" });
                    return;
                }

                if (!data.hasApplied) {
                    setView({ kind: "form" });
                    return;
                }

                if (data.examStatus === "submitted") {
                    if (data.decision === "selected") {
                        setView({ kind: "decided", decision: "selected" });
                    } else if (data.decision === "rejected") {
                        setView({ kind: "decided", decision: "rejected" });
                    } else {
                        setView({ kind: "awaiting-result" });
                    }
                    return;
                }

                setView({
                    kind: "exam-gate",
                    examStatus:
                        data.examStatus === "in_progress"
                            ? "in_progress"
                            : "not_started",
                });

            } catch (error) {
                console.error(error);
                if (!cancelled) setView({ kind: "form" });
            }

        }

        loadExamState();

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

            setView({ kind: "exam-gate", examStatus: "not_started" });
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

    function handleStartExam() {
        setInstructionsOpen(false);
        router.push("/edp/exam");
    }

    if (view.kind === "checking") {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
            >
                <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            </section>
        );
    }

    if (view.kind === "exam-gate") {

        const resuming = view.examStatus === "in_progress";

        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 text-center sm:px-6 sm:py-24"
            >

                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-10">

                    <PlayCircle className="mx-auto h-12 w-12 text-amber-400" />

                    <h2 className="mt-4 text-2xl font-bold text-white">
                        {resuming
                            ? "Your Exam Is In Progress"
                            : "You're Ready For The Entrance Exam"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        {resuming
                            ? "It looks like your exam session is still open. Resume to pick up where you left off — your timer keeps running in the background."
                            : "30 questions, 30 minutes. Once you begin, please stay on this exam until you submit — leaving the page will end it automatically."}
                    </p>

                    <button
                        type="button"
                        onClick={() => setInstructionsOpen(true)}
                        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300 sm:w-auto sm:px-8"
                    >
                        {resuming ? "Resume Exam" : "Begin Exam"}
                    </button>

                </div>

                <EdpExamInstructionsDialog
                    open={instructionsOpen}
                    onOpenChange={setInstructionsOpen}
                    onStartExam={handleStartExam}
                    resuming={resuming}
                />

            </section>
        );
    }

    if (view.kind === "awaiting-result") {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 text-center sm:px-6 sm:py-24"
            >

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10">

                    <Hourglass className="mx-auto h-12 w-12 text-white/50" />

                    <h2 className="mt-4 text-2xl font-bold text-white">
                        Exam Submitted
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        Thanks for completing the EDP entrance exam.
                        We&apos;re reviewing your result and will update you
                        here soon.
                    </p>

                </div>

            </section>
        );
    }

    if (view.kind === "decided" && view.decision === "selected") {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 text-center sm:px-6 sm:py-24"
            >

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-10">

                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />

                    <h2 className="mt-4 text-2xl font-bold text-white">
                        You&apos;ve Been Selected!
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        Congratulations — you&apos;ve been selected for the
                        Ekalavya Drone Program. We&apos;ll be in touch soon
                        with further details.
                    </p>

                </div>

            </section>
        );
    }

    if (view.kind === "decided" && view.decision === "rejected") {
        return (
            <section
                id="edp-exam-form"
                className="mx-auto max-w-xl scroll-mt-16 px-4 py-16 text-center sm:px-6 sm:py-24"
            >

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10">

                    <XCircle className="mx-auto h-12 w-12 text-white/40" />

                    <h2 className="mt-4 text-2xl font-bold text-white">
                        Application Not Selected
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        Thank you for your interest and for taking the time
                        to complete our entrance exam. After careful review,
                        we won&apos;t be moving forward with your
                        application this time.
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
