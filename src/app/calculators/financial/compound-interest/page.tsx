
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Compound Interest Calculator',
    description: 'Calculate the future value of your investment with the power of compound interest. Works for savings, investments, and loans.'
};

export default function CompoundInterestCalculatorPage() {
    return <CompoundInterestCalculator />;
}
