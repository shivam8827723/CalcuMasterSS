import { BasicCalculator } from "@/components/calculators/basic-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Scientific Calculator',
    description: 'A free, online scientific calculator with support for basic and advanced functions like trigonometry, logarithms, and more.'
};

export default function BasicCalculatorPage() {
    return <BasicCalculator />;
}
