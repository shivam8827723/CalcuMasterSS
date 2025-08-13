
import { ProbabilityCalculator } from "@/components/calculators/probability-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Probability Calculator',
    description: 'Calculate the probability of an event based on the number of favorable outcomes and total outcomes.'
};

export default function ProbabilityCalculatorPage() {
  return <ProbabilityCalculator />;
}
