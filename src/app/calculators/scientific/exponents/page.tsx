
import { ExponentsCalculator } from "@/components/calculators/exponents-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Exponents & Powers Calculator',
    description: 'Easily calculate powers, roots (square root, cube root, nth root) of numbers with this free online calculator.'
};

export default function ExponentsCalculatorPage() {
    return <ExponentsCalculator />;
}
