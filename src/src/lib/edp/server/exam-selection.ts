/**
 * SERVER-ONLY. Picks a random exam question set and prepares the
 * answer-free version sent to the client. Never import this from a
 * "use client" file — it transitively pulls in the answer key from
 * ./question-bank.
 */

import {
    ALL_QUESTIONS,
    BankQuestion,
    SECTION_A_QUESTIONS,
    SECTION_B_QUESTIONS,
    getQuestionById,
} from "./question-bank";

import {
    SECTION_A_PICK_COUNT,
    SECTION_B_PICK_COUNT,
} from "@/lib/edp/exam-config";

import { ClientExamQuestion, ExamAnswerMap } from "@/types/edp-exam";

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function pickRandom<T>(items: T[], count: number): T[] {
    return shuffle(items).slice(0, count);
}

/**
 * Randomly selects SECTION_A_PICK_COUNT typed-answer questions from
 * Section A and SECTION_B_PICK_COUNT multiple-choice questions from
 * Section B, then shuffles the combined set into the order the
 * applicant will see them in. Returns just the ids — the canonical
 * record of "which questions were assigned" that gets persisted on
 * the application doc.
 */
export function selectExamQuestionIds(): number[] {
    const sectionA = pickRandom(SECTION_A_QUESTIONS, SECTION_A_PICK_COUNT);
    const sectionB = pickRandom(SECTION_B_QUESTIONS, SECTION_B_PICK_COUNT);

    const combined = shuffle([...sectionA, ...sectionB]);

    return combined.map((q) => q.id);
}

function stripAnswer(question: BankQuestion): ClientExamQuestion {
    if (question.type === "mcq") {
        return {
            id: question.id,
            type: "mcq",
            prompt: question.prompt,
            options: question.options.map((o) => ({ id: o.id, text: o.text })),
        };
    }

    return {
        id: question.id,
        type: "typed",
        prompt: question.prompt,
    };
}

/**
 * Converts previously-assigned question ids (in their stored
 * presentation order) into the answer-free shape sent to the client.
 * Throws if an id doesn't resolve — that would mean stored data is
 * corrupt, and it's better to fail loudly than silently drop a
 * question from someone's exam.
 */
export function toClientQuestions(ids: number[]): ClientExamQuestion[] {
    return ids.map((id) => {
        const question = getQuestionById(id);

        if (!question) {
            throw new Error(`Unknown exam question id: ${id}`);
        }

        return stripAnswer(question);
    });
}

/**
 * Scores a completed exam. `answers` maps question id (as a string
 * key, matching Firestore map constraints) to the applicant's answer.
 *
 * Only multiple-choice (Section B) questions are auto-graded here —
 * typed (Section A) answers are never compared against anything
 * automatically; they're left for an admin to review and grade
 * manually. An unanswered or invalid MCQ simply doesn't count toward
 * the score, matching the "0 marks for unanswered" rule. The maximum
 * possible return value is therefore SECTION_B_PICK_COUNT (20), not
 * the full 30-question total — see AUTO_GRADED_MARKS in exam-config.
 */
export function scoreExam(
    questionIds: number[],
    answers: ExamAnswerMap
): number {
    let score = 0;

    for (const id of questionIds) {
        const question = getQuestionById(id);

        if (!question || question.type !== "mcq") continue;

        const given = answers[String(id)];

        if (given && given === question.correctOptionId) {
            score += 1;
        }
    }

    return score;
}

// Re-exported so callers that already have this module open can
// sanity-check bank size without a second import.
export const TOTAL_BANK_SIZE = ALL_QUESTIONS.length;
