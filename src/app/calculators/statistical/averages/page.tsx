
import { AveragesCalculator } from "@/components/calculators/averages-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Averages Calculator',
    description: 'Calculate the mean, median, and mode from a list of numbers with this free online statistical calculator.'
};

export default function AveragesCalculatorPage() {
  return <AveragesCalculator />;
}
