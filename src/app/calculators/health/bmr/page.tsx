
import { BmrCalculator } from "@/components/calculators/bmr-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on your age, gender, height, weight, and activity level.'
};

export default function BmrCalculatorPage() {
  return <BmrCalculator />;
}
