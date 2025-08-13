
import { DiscountCalculator } from "@/components/calculators/discount-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Discount Calculator',
    description: 'Calculate the final price after a discount and see how much you save with this easy-to-use calculator.'
};

export default function DiscountCalculatorPage() {
  return <DiscountCalculator />;
}
