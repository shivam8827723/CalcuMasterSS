
import { BmiCalculator } from "@/components/calculators/bmi-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) to assess your weight status. Works with both metric and imperial units.'
};

export default function BmiCalculatorPage() {
  return <BmiCalculator />;
}
