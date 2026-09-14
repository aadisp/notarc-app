"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { auth } from "@/firebase/firebase";
import type { AnswerSheetEntry } from "@/app/api/edp/admin/answer-sheet/route";

interface Props {
    applicationId: string;
}

export default function EdpAnswerSheet({ applicationId }: Props) {

    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [answerSheet, setAnswerSheet] = useState<AnswerSheetEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function handleExpand() {

        const next = !expanded;
        setExpanded(next);

        if (!next || loaded) return;

        setLoading(true);
        setError(null);

        try {

            const user = auth.currentUser;

            if (!user) {
                setError("Not logged in.");
                return;
            }

            const idToken = await user.getIdToken();

            const response = await fetch(
                "/api/edp/admin/answer-sheet",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken, applicationId }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Could not load the answer sheet.");
                return;
            }

            setAnswerSheet(data.answerSheet);
            setLoaded(true);

        } catch (err) {

            console.error(err);
            setError("Could not load the answer sheet.");

        } finally {
            setLoading(false);
        }

    }

    const sectionA = answerSheet.filter((entry) => entry.type === "typed");
    const sectionB = answerSheet.filter((entry) => entry.type === "mcq");

    return (
        <div className="rounded-xl border">

            <button
                type="button"
                onClick={handleExpand}
                className="flex w-full items-center justify-between p-4 text-left font-semibold"
            >
                Answer Sheet
                {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>

            {expanded && (
                <div className="max-h-[60vh] space-y-6 overflow-y-auto border-t p-4">

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading answer sheet...
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    {!loading && !error && loaded && (
                        <>

                            {sectionA.length > 0 && (
                                <div>

                                    <p className="mb-3 text-sm font-semibold text-muted-foreground">
                                        Section A — Typed Answers ({sectionA.length})
                                        <span className="ml-2 font-normal">
                                            Not auto-graded — review manually.
                                        </span>
                                    </p>

                                    <div className="space-y-4">
                                        {sectionA.map((entry, index) => (
                                            <div
                                                key={entry.id}
                                                className="rounded-lg border p-3"
                                            >
                                                <p className="text-sm font-medium">
                                                    {index + 1}. {entry.prompt}
                                                </p>

                                                <div className="mt-2 grid gap-2 sm:grid-cols-2">

                                                    <div className="rounded-md bg-slate-50 p-2">
                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                            Applicant answered
                                                        </p>
                                                        <p className="text-sm">
                                                            {entry.givenAnswer || (
                                                                <span className="italic text-muted-foreground">
                                                                    No answer given
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-md bg-emerald-50 p-2">
                                                        <p className="text-xs font-semibold text-emerald-700">
                                                            Reference answer
                                                        </p>
                                                        <p className="text-sm text-emerald-900">
                                                            {entry.correctAnswer}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                            {sectionB.length > 0 && (
                                <div>

                                    <p className="mb-3 text-sm font-semibold text-muted-foreground">
                                        Section B — Multiple Choice ({sectionB.length})
                                    </p>

                                    <div className="space-y-4">
                                        {sectionB.map((entry, index) => (
                                            <div
                                                key={entry.id}
                                                className="rounded-lg border p-3"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium">
                                                        {index + 1}. {entry.prompt}
                                                    </p>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                            entry.isCorrect
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {entry.isCorrect
                                                            ? "Correct"
                                                            : "Incorrect"}
                                                    </span>
                                                </div>

                                                <div className="mt-2 space-y-1.5">
                                                    {entry.options?.map((option) => {

                                                        const wasGiven =
                                                            entry.givenAnswer ===
                                                            option.id;

                                                        const isCorrectOption =
                                                            entry.correctOptionId ===
                                                            option.id;

                                                        return (
                                                            <div
                                                                key={option.id}
                                                                className={`rounded-md border px-2.5 py-1.5 text-sm ${
                                                                    isCorrectOption
                                                                        ? "border-emerald-300 bg-emerald-50"
                                                                        : wasGiven
                                                                        ? "border-red-300 bg-red-50"
                                                                        : "border-slate-200"
                                                                }`}
                                                            >
                                                                <span className="font-semibold">
                                                                    {option.id}.
                                                                </span>{" "}
                                                                {option.text}
                                                                {wasGiven && (
                                                                    <span className="ml-2 text-xs italic text-muted-foreground">
                                                                        (applicant's choice)
                                                                    </span>
                                                                )}
                                                                {isCorrectOption && (
                                                                    <span className="ml-2 text-xs italic text-emerald-700">
                                                                        (correct answer)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {!entry.givenAnswer && (
                                                        <p className="text-xs italic text-muted-foreground">
                                                            No answer given
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                        </>
                    )}

                </div>
            )}

        </div>
    );
}