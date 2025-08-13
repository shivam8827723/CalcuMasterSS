
import { SimpleInterestCalculator } from "@/components/calculators/simple-interest-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Simple Interest Calculator',
    description: 'Calculate simple interest on a principal amount over time with our easy-to-use online calculator.'
};

export default function SimpleInterestCalculatorPage() {
    return <SimpleInterestCalculator />;
}
