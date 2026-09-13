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

import { ClientExamQuestion } from "@/types/edp-exam";

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
 * Randomly selects SECTION_A_PICK_COUNT questions from Section A and
 * SECTION_B_PICK_COUNT from Section B, then shuffles the combined set
 * into the order the applicant will see them in. Returns just the
 * ids — the canonical record of "which questions were assigned" that
 * gets persisted on the application doc.
 */
export function selectExamQuestionIds(): number[] {
    const sectionA = pickRandom(SECTION_A_QUESTIONS, SECTION_A_PICK_COUNT);
    const sectionB = pickRandom(SECTION_B_QUESTIONS, SECTION_B_PICK_COUNT);

    const combined = shuffle([...sectionA, ...sectionB]);

    return combined.map((q) => q.id);
}

function stripAnswer(question: BankQuestion): ClientExamQuestion {
    return {
        id: question.id,
        prompt: question.prompt,
        options: question.options.map((o) => ({ id: o.id, text: o.text })),
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
 * key, matching Firestore map constraints) to the selected option id.
 * An unanswered or invalid question simply doesn't count toward the
 * score, matching the "0 marks for unanswered" rule.
 */
export function scoreExam(
    questionIds: number[],
    answers: Record<string, string | undefined>
): number {
    let score = 0;

    for (const id of questionIds) {
        const question = getQuestionById(id);

        if (!question) continue;

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
