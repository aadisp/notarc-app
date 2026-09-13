/**
 * Shared EDP entrance exam constants. Contains no answer-key data, so
 * this file is safe to import from client components as well as
 * server-only code.
 */

export const SECTION_A_PICK_COUNT = 10;
export const SECTION_B_PICK_COUNT = 20;
export const TOTAL_EXAM_QUESTIONS =
    SECTION_A_PICK_COUNT + SECTION_B_PICK_COUNT;

export const EXAM_DURATION_SECONDS = 30 * 60; // 30 minutes
export const EXAM_TOTAL_MARKS = TOTAL_EXAM_QUESTIONS; // 1 mark per question
