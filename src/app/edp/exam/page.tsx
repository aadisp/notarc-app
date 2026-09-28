import type { Metadata } from "next";
import EdpExamRunner from "@/components/edp/edp-exam-runner";

export const metadata: Metadata = {
    title: "Entrance Exam — Ekalavya Drone Program",
};

export default function EdpExamPage() {
    return <EdpExamRunner />;
}
