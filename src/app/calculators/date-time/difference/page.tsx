
import { DateDifferenceCalculator } from "@/components/calculators/date-difference-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Date Difference Calculator',
    description: 'Calculate the duration and number of days between two dates with this easy-to-use online tool.'
};

export default function DateDifferenceCalculatorPage() {
    return <DateDifferenceCalculator />;
}
