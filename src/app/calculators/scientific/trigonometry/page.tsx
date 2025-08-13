
import { TrigonometryCalculator } from "@/components/calculators/trigonometry-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trigonometry Calculator',
    description: 'Calculate trigonometric functions like sine, cosine, tangent, and their inverses for a given angle in degrees or radians.'
};

export default function TrigonometryCalculatorPage() {
    return <TrigonometryCalculator />;
}
