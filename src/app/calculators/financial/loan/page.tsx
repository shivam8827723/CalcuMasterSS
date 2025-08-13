
import { LoanEmiCalculator } from "@/components/calculators/loan-emi-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Loan/EMI Calculator',
    description: 'Calculate your Equated Monthly Installment (EMI) for a loan. Find out your monthly payment, total interest, and total payment.'
};

export default function LoanEmiCalculatorPage() {
    return <LoanEmiCalculator />;
}
