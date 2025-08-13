
import { SalesTaxCalculator } from "@/components/calculators/sales-tax-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sales Tax Calculator',
    description: 'Quickly calculate sales tax and the final price of an item. You can add or extract tax from a price.'
};

export default function SalesTaxCalculatorPage() {
  return <SalesTaxCalculator />;
}
