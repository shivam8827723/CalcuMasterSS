
import { AgeCalculator } from "@/components/calculators/age-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Age Calculator',
    description: 'Calculate your age in years, months, and days based on your date of birth. Find out exactly how old you are.'
};

export default function AgeCalculatorPage() {
    return <AgeCalculator />;
}
