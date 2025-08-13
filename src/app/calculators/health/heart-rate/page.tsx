
import { HeartRateCalculator } from "@/components/calculators/heart-rate-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Target Heart Rate Zone Calculator',
    description: 'Find your target heart rate zones for effective exercise and fat burning based on your age.'
};

export default function HeartRateCalculatorPage() {
  return <HeartRateCalculator />;
}
