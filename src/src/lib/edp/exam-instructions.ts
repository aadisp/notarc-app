import {
    EXAM_DURATION_SECONDS,
    EXAM_TOTAL_MARKS,
    TOTAL_EXAM_QUESTIONS,
} from "./exam-config";

const EXAM_DURATION_MINUTES = EXAM_DURATION_SECONDS / 60;

export const EXAM_INSTRUCTIONS_TITLE = "Before You Begin";

export const EXAM_INSTRUCTIONS: string[] = [
    `Test Duration: The total time allotted for the test is ${EXAM_DURATION_MINUTES} minutes.`,
    `Total Questions: There are ${TOTAL_EXAM_QUESTIONS} questions in the test.`,
    `Marks: Each question carries 1 mark. The maximum score is ${EXAM_TOTAL_MARKS} marks.`,
    "Unanswered Questions: If a question is left unanswered, 0 marks will be awarded for that question.",
    "Different Question Sets: Questions may be different for each participant. The question order and/or questions shown to you may vary from those shown to other participants.",
    "No Cheating: Students must complete the test independently. Any form of cheating, use of external assistance, or unauthorized resources is strictly prohibited.",
    "Do Not Minimize or Switch Tabs: Do not minimize the test window, switch to another tab, open another application, or navigate away from the test page during the examination.",
    "AI-Based Monitoring: The test is monitored using an AI-based proctoring system. Changes in your test environment or suspicious activities may be detected and recorded automatically.",
    "Camera & Microphone: Camera and microphone access may be enabled by the backend/proctoring system for examination monitoring. Please ensure that your device permissions and equipment are ready before starting.",
    "Monitoring & Verification: Any unusual activity detected during the examination may be reviewed for verification. Participants are expected to maintain proper examination discipline throughout the test.",
    "No External Help: Do not use Google, mobile phones, books, notes, ChatGPT/AI tools, other websites, or assistance from another person during the test.",
    "Technical Issues: Ensure you have a stable internet connection, charged device, working camera/microphone (if required), and a suitable examination environment before starting.",
    "Leaving This Page: If you switch tabs, switch or minimize an app, or otherwise navigate away from the exam page after starting, your test will be submitted immediately in its current state.",
];
