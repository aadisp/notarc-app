"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertTriangle,
    Camera,
    Loader2,
    ShieldAlert,
    Video,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import {
    ClientExamQuestion,
    ExamAnswerMap,
    ExamStartPayload,
    ExamStatePayload,
    ExamSubmitReason,
} from "@/types/edp-exam";

type Phase =
    | "loading"
    | "permission"
    | "requesting"
    | "permission-denied"
    | "running"
    | "ended";

type OptionId = "A" | "B" | "C" | "D";

function formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const ENDED_MESSAGES: Record<ExamSubmitReason, { title: string; body: string }> = {
    manual: {
        title: "Exam Submitted",
        body: "Your answers have been recorded. Redirecting you back...",
    },
    timeout: {
        title: "Time's Up",
        body: "Your 30 minutes are up, so your exam was submitted automatically with your answers so far.",
    },
    left_page: {
        title: "Exam Ended",
        body: "You left the exam page, so it was automatically submitted with your answers so far.",
    },
};

export default function EdpExamRunner() {

    const router = useRouter();

    const [phase, setPhase] = useState<Phase>("loading");
    const [resuming, setResuming] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(
        null
    );

    const [questions, setQuestions] = useState<ClientExamQuestion[]>([]);
    const [answers, setAnswers] = useState<ExamAnswerMap>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remainingMs, setRemainingMs] = useState(0);
    const [endReason, setEndReason] = useState<ExamSubmitReason>("manual");
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Refs mirror state that event listeners and timers need to read
    // at call time, without re-subscribing on every render.
    const phaseRef = useRef<Phase>("loading");
    const answersRef = useRef<ExamAnswerMap>({});
    const idTokenRef = useRef<string | null>(null);
    const deadlineRef = useRef<number>(0);
    const clockOffsetRef = useRef<number>(0);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hasEndedRef = useRef(false);

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    const cleanupMedia = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }, []);

    const submitExam = useCallback(
        async (reason: ExamSubmitReason) => {

            if (hasEndedRef.current) return;
            hasEndedRef.current = true;

            phaseRef.current = "ended";
            setEndReason(reason);
            setPhase("ended");
            cleanupMedia();

            const idToken = idTokenRef.current;
            if (!idToken) return;

            const payload = JSON.stringify({
                idToken,
                answers: answersRef.current,
                reason,
            });

            try {
                // A page that's merely backgrounded (tab/app switch) can
                // still run a normal fetch to completion. A page that's
                // actually unloading (closing the tab, navigating away)
                // needs sendBeacon, which is designed to survive that —
                // fetch could get cancelled mid-flight in that case.
                if (reason === "left_page" && document.visibilityState === "hidden") {
                    navigator.sendBeacon(
                        "/api/edp/exam/submit",
                        new Blob([payload], { type: "application/json" })
                    );
                } else {
                    await fetch("/api/edp/exam/submit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        keepalive: true,
                        body: payload,
                    });
                }
            } catch (error) {
                console.error("exam submit failed:", error);
            }

        },
        [cleanupMedia]
    );

    // --- Eligibility check on mount ---------------------------------
    useEffect(() => {

        let cancelled = false;

        async function checkEligibility() {

            const user = auth.currentUser;

            if (!user) {
                router.replace("/login");
                return;
            }

            try {

                const idToken = await user.getIdToken();
                idTokenRef.current = idToken;

                const response = await fetch("/api/edp/exam/state", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                const data = (await response.json()) as
                    | ExamStatePayload
                    | { error: string };

                if (cancelled) return;

                if (
                    !response.ok ||
                    "error" in data ||
                    !data.hasApplied ||
                    data.examStatus === "submitted"
                ) {
                    router.replace("/edp");
                    return;
                }

                setResuming(data.examStatus === "in_progress");
                setPhase("permission");

            } catch (error) {
                console.error(error);
                if (!cancelled) router.replace("/edp");
            }

        }

        checkEligibility();

        return () => {
            cancelled = true;
        };

    }, [router]);

    // --- Camera/mic gate then server-side start/resume ---------------
    async function handleGrantAccess() {

        setPermissionError(null);
        setPhase("requesting");

        if (!navigator.mediaDevices?.getUserMedia) {
            setPermissionError(
                "Your browser doesn't support camera/microphone access. Please use an updated Chrome, Safari, or Edge."
            );
            setPhase("permission-denied");
            return;
        }

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            mediaStreamRef.current = stream;

            const user = auth.currentUser;

            if (!user) {
                router.replace("/login");
                return;
            }

            const idToken = await user.getIdToken();
            idTokenRef.current = idToken;

            const response = await fetch("/api/edp/exam/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            const data = (await response.json()) as
                | ExamStartPayload
                | { error: string };

            if (!response.ok || "error" in data) {
                toast.error(
                    ("error" in data && data.error) ||
                        "Could not start the exam."
                );
                cleanupMedia();
                router.replace("/edp");
                return;
            }

            setQuestions(data.questions);

            const initialAnswers = data.savedAnswers ?? {};
            answersRef.current = initialAnswers;
            setAnswers(initialAnswers);

            clockOffsetRef.current = data.serverNow - Date.now();
            deadlineRef.current =
                data.startedAt + data.durationSeconds * 1000;

            setRemainingMs(
                Math.max(
                    0,
                    deadlineRef.current -
                        (Date.now() + clockOffsetRef.current)
                )
            );

            if (document.documentElement.requestFullscreen) {
                document.documentElement
                    .requestFullscreen()
                    .catch(() => {});
            }

            setPhase("running");

        } catch (error) {
            console.error(error);
            setPermissionError(
                "Camera and microphone access is required to begin the exam. Please allow access in your browser settings and try again."
            );
            setPhase("permission-denied");
        }

    }

    // --- Attach camera preview once running --------------------------
    useEffect(() => {
        if (phase === "running" && videoRef.current && mediaStreamRef.current) {
            videoRef.current.srcObject = mediaStreamRef.current;
        }
    }, [phase]);

    // --- Countdown ticker ---------------------------------------------
    useEffect(() => {

        if (phase !== "running") return;

        const interval = setInterval(() => {

            const remaining =
                deadlineRef.current - (Date.now() + clockOffsetRef.current);

            if (remaining <= 0) {
                setRemainingMs(0);
                submitExam("timeout");
            } else {
                setRemainingMs(remaining);
            }

        }, 1000);

        return () => clearInterval(interval);

    }, [phase, submitExam]);

    // --- Leave-detection: tab/app switch, navigating away, fullscreen exit
    useEffect(() => {

        function handleVisibilityChange() {
            if (
                document.visibilityState === "hidden" &&
                phaseRef.current === "running"
            ) {
                submitExam("left_page");
            }
        }

        function handleBlur() {
            if (phaseRef.current === "running") {
                submitExam("left_page");
            }
        }

        function handlePageHide() {
            if (phaseRef.current === "running") {
                submitExam("left_page");
            }
        }

        function handleFullscreenChange() {
            if (
                phaseRef.current === "running" &&
                !document.fullscreenElement
            ) {
                submitExam("left_page");
            }
        }

        function handleBeforeUnload(event: BeforeUnloadEvent) {
            if (phaseRef.current === "running") {
                event.preventDefault();
                event.returnValue = "";
            }
        }

        function handlePopState() {
            if (phaseRef.current === "running") {
                submitExam("left_page");
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        // A dummy history entry so the back button fires a popstate we
        // can react to instead of silently leaving the exam.
        window.history.pushState(null, "", window.location.href);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("pagehide", handlePageHide);
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };

    }, [submitExam]);

    // Stop the camera if the component unmounts for any reason while
    // still running (e.g. a programmatic navigation elsewhere).
    useEffect(() => {
        return () => {
            cleanupMedia();
        };
    }, [cleanupMedia]);

    function selectAnswer(questionId: number, optionId: OptionId) {

        setAnswers((current) => {
            const next = { ...current, [String(questionId)]: optionId };
            answersRef.current = next;
            return next;
        });

        const idToken = idTokenRef.current;
        if (!idToken) return;

        fetch("/api/edp/exam/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({ idToken, questionId, optionId }),
        }).catch((error) => {
            console.error("autosave failed:", error);
        });

    }

    async function handleManualSubmit() {
        setShowSubmitConfirm(false);
        await submitExam("manual");
        router.replace("/edp");
    }

    const answeredCount = Object.keys(answers).length;
    const currentQuestion = questions[currentIndex];
    const isLowTime = remainingMs <= 2 * 60 * 1000;

    // ------------------------------------------------------------------
    if (phase === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
            </div>
        );
    }

    if (phase === "permission" || phase === "requesting" || phase === "permission-denied") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10">
                        {phase === "permission-denied" ? (
                            <AlertTriangle className="h-7 w-7 text-amber-400" />
                        ) : (
                            <Camera className="h-7 w-7 text-amber-400" />
                        )}
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-white">
                        {phase === "permission-denied"
                            ? "Access Needed"
                            : "Camera & Microphone Required"}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        {permissionError ??
                            "This exam is proctored. Allow camera and microphone access to begin — your 30-minute timer starts right after."}
                    </p>

                    <button
                        type="button"
                        onClick={handleGrantAccess}
                        disabled={phase === "requesting"}
                        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {phase === "requesting" && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {phase === "requesting"
                            ? "Requesting Access..."
                            : phase === "permission-denied"
                            ? "Try Again"
                            : resuming
                            ? "Allow Access & Resume"
                            : "Allow Access & Begin"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.replace("/edp")}
                        className="mt-3 text-xs font-medium text-white/40 hover:text-white/60"
                    >
                        Cancel and go back
                    </button>

                </div>
            </div>
        );
    }

    if (phase === "ended") {
        const message = ENDED_MESSAGES[endReason];
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06]">
                        <ShieldAlert className="h-7 w-7 text-white/60" />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-white">
                        {message.title}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                        {message.body}
                    </p>

                    <button
                        type="button"
                        onClick={() => router.replace("/edp")}
                        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300"
                    >
                        Return to EDP
                    </button>

                </div>
            </div>
        );
    }

    // phase === "running"
    return (
        <div className="flex min-h-screen flex-col">

            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0d10]/95 px-4 py-3 backdrop-blur-xl">
                <div className="mx-auto flex max-w-2xl items-center justify-between">

                    <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                        Question {currentIndex + 1}
                        <span className="text-white/20"> / {questions.length}</span>
                    </div>

                    <div
                        className={`rounded-full border px-3 py-1 text-sm font-bold tabular-nums ${
                            isLowTime
                                ? "border-red-400/30 bg-red-400/10 text-red-400"
                                : "border-white/10 bg-white/5 text-white"
                        }`}
                    >
                        {formatTime(remainingMs)}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowSubmitConfirm(true)}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
                    >
                        Submit
                    </button>

                </div>

                <div className="mx-auto mt-3 flex max-w-2xl gap-1.5 overflow-x-auto pb-1">
                    {questions.map((q, index) => {
                        const isAnswered = Boolean(answers[String(q.id)]);
                        const isCurrent = index === currentIndex;
                        return (
                            <button
                                key={q.id}
                                type="button"
                                onClick={() => setCurrentIndex(index)}
                                className={`
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    transition
                                    ${
                                        isCurrent
                                            ? "bg-amber-400 text-black"
                                            : isAnswered
                                            ? "bg-emerald-400/20 text-emerald-300"
                                            : "bg-white/5 text-white/40"
                                    }
                                `}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </header>

            <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">

                {currentQuestion && (
                    <div>

                        <h2 className="text-lg font-semibold leading-7 text-white">
                            {currentQuestion.prompt}
                        </h2>

                        <div className="mt-5 space-y-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected =
                                    answers[String(currentQuestion.id)] ===
                                    option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() =>
                                            selectAnswer(
                                                currentQuestion.id,
                                                option.id
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-start
                                            gap-3
                                            rounded-xl
                                            border
                                            px-4
                                            py-3.5
                                            text-left
                                            text-sm
                                            leading-6
                                            transition
                                            ${
                                                isSelected
                                                    ? "border-amber-400/60 bg-amber-400/[0.08] text-white"
                                                    : "border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.05]"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                mt-0.5
                                                flex
                                                h-5
                                                w-5
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                text-[10px]
                                                font-bold
                                                ${
                                                    isSelected
                                                        ? "border-amber-400 bg-amber-400 text-black"
                                                        : "border-white/20 text-white/40"
                                                }
                                            `}
                                        >
                                            {option.id}
                                        </span>
                                        <span>{option.text}</span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                )}

            </main>

            <footer className="sticky bottom-0 z-30 border-t border-white/10 bg-[#0b0d10]/95 px-4 py-3 backdrop-blur-xl [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
                <div className="mx-auto flex max-w-2xl items-center gap-3">

                    <button
                        type="button"
                        disabled={currentIndex === 0}
                        onClick={() =>
                            setCurrentIndex((i) => Math.max(0, i - 1))
                        }
                        className="h-11 flex-1 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Previous
                    </button>

                    {currentIndex < questions.length - 1 ? (
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentIndex((i) =>
                                    Math.min(questions.length - 1, i + 1)
                                )
                            }
                            className="h-11 flex-1 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowSubmitConfirm(true)}
                            className="h-11 flex-1 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300"
                        >
                            Submit Exam
                        </button>
                    )}

                </div>
            </footer>

            {/* Cosmetic proctoring indicator — never uploaded or recorded */}
            <div className="pointer-events-none fixed bottom-20 right-4 z-40 h-24 w-20 overflow-hidden rounded-lg border border-white/15 bg-black shadow-xl sm:bottom-4">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute left-1 top-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wide text-white/80">
                        Live
                    </span>
                </div>
            </div>

            {showSubmitConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151a] p-6 text-center">

                        <Video className="mx-auto h-8 w-8 text-amber-400" />

                        <h3 className="mt-3 text-base font-bold text-white">
                            Submit your exam?
                        </h3>

                        <p className="mt-2 text-sm text-white/60">
                            You&apos;ve answered {answeredCount} of{" "}
                            {questions.length} questions. This can&apos;t be
                            undone.
                        </p>

                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSubmitConfirm(false)}
                                className="h-11 flex-1 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:bg-white/10"
                            >
                                Keep Going
                            </button>
                            <button
                                type="button"
                                onClick={handleManualSubmit}
                                className="h-11 flex-1 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300"
                            >
                                Submit
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
