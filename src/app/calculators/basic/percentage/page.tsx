
import { PercentageCalculator } from "@/components/calculators/percentage-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Percentage Calculator',
    description: 'Easily calculate percentages, percentage of a number, tips, and discounts with this free online tool.'
};

export default function PercentageCalculatorPage() {
    return <PercentageCalculator />;
}
