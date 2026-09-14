/**
 * Shared EDP entrance exam constants. Contains no answer-key data, so
 * this file is safe to import from client components as well as
 * server-only code.
 */

export const SECTION_A_PICK_COUNT = 10; // typed-answer, manually graded
export const SECTION_B_PICK_COUNT = 20; // multiple-choice, auto-graded
export const TOTAL_EXAM_QUESTIONS =
    SECTION_A_PICK_COUNT + SECTION_B_PICK_COUNT;

export const EXAM_DURATION_SECONDS = 30 * 60; // 30 minutes
export const EXAM_TOTAL_MARKS = TOTAL_EXAM_QUESTIONS; // 1 mark per question, once fully graded

// The `score` field on an application is computed automatically at
// submit time and only ever covers the Section B multiple-choice
// questions — the Section A typed answers are never auto-graded, so
// this is the correct max to compare `score` against until an admin
// has also graded those.
export const AUTO_GRADED_MARKS = SECTION_B_PICK_COUNT;
