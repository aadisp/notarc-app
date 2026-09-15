"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { auth } from "@/firebase/firebase";
import type { AnswerSheetEntry } from "@/app/api/edp/admin/answer-sheet/route";

interface Props {
    applicationId: string;
}

type MarkingMap = Record<string, "right" | "wrong">;

export default function EdpAnswerSheet({ applicationId }: Props) {

    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [answerSheet, setAnswerSheet] = useState<AnswerSheetEntry[]>([]);
    const [marking, setMarking] = useState<MarkingMap>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

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

            const sheet: AnswerSheetEntry[] = data.answerSheet;

            setAnswerSheet(sheet);

            const initialMarking: MarkingMap = {};
            for (const entry of sheet) {
                if (entry.marking) {
                    initialMarking[String(entry.id)] = entry.marking;
                }
            }
            setMarking(initialMarking);

            setLoaded(true);

        } catch (err) {

            console.error(err);
            setError("Could not load the answer sheet.");

        } finally {
            setLoading(false);
        }

    }

    function markQuestion(questionId: number, value: "right" | "wrong") {
        setSaved(false);
        setMarking((current) => ({
            ...current,
            [String(questionId)]: value,
        }));
    }

    async function handleSave() {

        setSaving(true);
        setError(null);

        try {

            const user = auth.currentUser;
            if (!user) return;

            const idToken = await user.getIdToken();

            const response = await fetch(
                "/api/edp/admin/save-marking",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idToken,
                        applicationId,
                        marking,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Could not save marking.");
                return;
            }

            setSaved(true);

        } catch (err) {

            console.error(err);
            setError("Could not save marking.");

        } finally {
            setSaving(false);
        }

    }

    const currentEntry = answerSheet[currentIndex];
    const markedCount = Object.keys(marking).length;
    const rightCount = Object.values(marking).filter(
        (v) => v === "right"
    ).length;

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
                <div className="border-t">

                    {loading && (
                        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading answer sheet...
                        </div>
                    )}

                    {error && (
                        <p className="p-4 text-sm text-red-600">{error}</p>
                    )}

                    {!loading && loaded && currentEntry && (
                        <div className="max-h-[75vh] overflow-y-auto rounded-b-xl bg-[#0b0d10]">

                            {/* Header, styled to match the applicant's exam view */}
                            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d10]/95 px-4 py-3 backdrop-blur-xl">

                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                                        Question {currentIndex + 1}
                                        <span className="text-white/20">
                                            {" "}/ {answerSheet.length}
                                        </span>
                                    </div>

                                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold tabular-nums text-white">
                                        {rightCount} / {answerSheet.length} marked right
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                                    {answerSheet.map((entry, index) => {
                                        const mark = marking[String(entry.id)];
                                        return (
                                            <button
                                                key={entry.id}
                                                type="button"
                                                onClick={() => setCurrentIndex(index)}
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                                                    index === currentIndex
                                                        ? "bg-amber-400 text-black"
                                                        : mark === "right"
                                                        ? "bg-emerald-400/20 text-emerald-300"
                                                        : mark === "wrong"
                                                        ? "bg-red-400/20 text-red-300"
                                                        : "bg-white/5 text-white/40"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>

                            {/* Question content, mirroring the applicant's exam layout exactly */}
                            <div className="mx-auto w-full max-w-2xl px-4 py-6">

                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                        currentEntry.type === "mcq"
                                            ? "bg-white/10 text-white/50"
                                            : "bg-amber-400/10 text-amber-400"
                                    }`}
                                >
                                    {currentEntry.type === "mcq"
                                        ? "Multiple Choice"
                                        : "Typed Answer"}
                                </span>

                                <h2 className="mt-2 text-lg font-semibold leading-7 text-white">
                                    {currentEntry.prompt}
                                </h2>

                                {currentEntry.type === "mcq" ? (

                                    <div className="mt-5 space-y-3">
                                        {currentEntry.options?.map((option) => {
                                            const wasGiven =
                                                currentEntry.givenAnswer === option.id;
                                            const isCorrectOption =
                                                currentEntry.correctOptionId === option.id;

                                            return (
                                                <div
                                                    key={option.id}
                                                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm leading-6 ${
                                                        isCorrectOption
                                                            ? "border-emerald-400/60 bg-emerald-400/[0.08] text-white"
                                                            : wasGiven
                                                            ? "border-red-400/60 bg-red-400/[0.08] text-white"
                                                            : "border-white/10 bg-white/[0.02] text-white/60"
                                                    }`}
                                                >
                                                    <span
                                                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                                                            isCorrectOption
                                                                ? "border-emerald-400 bg-emerald-400 text-black"
                                                                : wasGiven
                                                                ? "border-red-400 bg-red-400 text-black"
                                                                : "border-white/20 text-white/40"
                                                        }`}
                                                    >
                                                        {option.id}
                                                    </span>
                                                    <span className="flex-1">
                                                        {option.text}
                                                    </span>
                                                    {wasGiven && (
                                                        <span className="text-xs italic text-white/50">
                                                            applicant's choice
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {!currentEntry.givenAnswer && (
                                            <p className="text-xs italic text-white/40">
                                                No answer given
                                            </p>
                                        )}
                                    </div>

                                ) : (

                                    <div className="mt-5 space-y-3">

                                        <textarea
                                            readOnly
                                            value={
                                                currentEntry.givenAnswer ||
                                                "(No answer given)"
                                            }
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm leading-6 text-white"
                                        />

                                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                                                Reference answer
                                            </p>
                                            <p className="mt-1 text-sm text-emerald-100">
                                                {currentEntry.correctAnswer}
                                            </p>
                                        </div>

                                    </div>

                                )}

                                {/* Marking control */}
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            markQuestion(currentEntry.id, "right")
                                        }
                                        className={`h-11 flex-1 rounded-full border text-sm font-semibold transition ${
                                            marking[String(currentEntry.id)] === "right"
                                                ? "border-emerald-400 bg-emerald-400 text-black"
                                                : "border-white/15 text-white/70 hover:bg-white/10"
                                        }`}
                                    >
                                        Mark Right (+1)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            markQuestion(currentEntry.id, "wrong")
                                        }
                                        className={`h-11 flex-1 rounded-full border text-sm font-semibold transition ${
                                            marking[String(currentEntry.id)] === "wrong"
                                                ? "border-red-400 bg-red-400 text-black"
                                                : "border-white/15 text-white/70 hover:bg-white/10"
                                        }`}
                                    >
                                        Mark Wrong (0)
                                    </button>
                                </div>

                            </div>

                            {/* Footer nav, mirroring the applicant's exam layout */}
                            <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[#0b0d10]/95 px-4 py-3 backdrop-blur-xl">
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

                                    {currentIndex < answerSheet.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentIndex((i) =>
                                                    Math.min(answerSheet.length - 1, i + 1)
                                                )
                                            }
                                            className="h-11 flex-1 rounded-full bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving || markedCount < answerSheet.length}
                                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {saving && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            )}
                                            {saved
                                                ? "Saved ✓"
                                                : `Save Marking (${rightCount}/${answerSheet.length})`}
                                        </button>
                                    )}

                                </div>

                                {markedCount < answerSheet.length && currentIndex === answerSheet.length - 1 && (
                                    <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-amber-400">
                                        Mark every question (right or wrong) before saving —
                                        {" "}{answerSheet.length - markedCount} left.
                                    </p>
                                )}

                            </div>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}