
import { LogarithmicCalculator } from "@/components/calculators/logarithmic-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Logarithmic Calculator',
    description: 'Calculate common logs (base 10), natural logs (base e), and logs with custom bases with this free online logarithm calculator.'
};

export default function LogarithmicCalculatorPage() {
    return <LogarithmicCalculator />;
}
