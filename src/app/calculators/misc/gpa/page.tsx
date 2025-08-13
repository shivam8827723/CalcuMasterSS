
import { GpaCalculator } from "@/components/calculators/gpa-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'GPA Calculator',
    description: 'Calculate your Grade Point Average (GPA) based on your course grades and credit hours.'
};

export default function GpaCalculatorPage() {
  return <GpaCalculator />;
}
