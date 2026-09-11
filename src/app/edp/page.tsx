import type { Metadata } from "next";
import EdpHero from "@/components/edp/edp-hero";
import EdpAbout from "@/components/edp/edp-about";
import EdpExamForm from "@/components/edp/edp-exam-form";

export const metadata: Metadata = {
  title: "Ekalavya Drone Program — Notarc",
};

export default function EdpPage() {
  return (
    <main>
      <EdpHero />
      <EdpAbout />
      <EdpExamForm />
    </main>
  );
}