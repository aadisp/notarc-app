import type { Metadata } from "next";
import InternshipHero from "@/components/internship/internship-hero";
import InternshipAbout from "@/components/internship/internship-about";
import InternshipVtu from "@/components/internship/internship-vtu";
import InternshipIndustry from "@/components/internship/internship-industry";
import InternshipCustom from "@/components/internship/internship-custom";

export const metadata: Metadata = {
  title: "Internship Program — Notarc",
};

export default function InternshipPage() {
  return (
    <main>
      <InternshipHero />
      <InternshipAbout />
      <InternshipVtu />
      <InternshipIndustry />
      <InternshipCustom />
    </main>
  );
}
