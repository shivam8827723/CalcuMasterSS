
import { TipCalculator } from "@/components/calculators/tip-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Tip Calculator',
    description: 'Calculate tips for services and split the bill among multiple people quickly and easily.'
};

export default function TipCalculatorPage() {
  return <TipCalculator />;
}
