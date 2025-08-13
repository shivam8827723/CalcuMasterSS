
import { CurrencyConverter } from "@/components/calculators/currency-converter";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Currency Converter',
    description: 'Convert amounts between different currencies with our free online converter. Includes major world currencies.'
};

export default function CurrencyConverterPage() {
    return <CurrencyConverter />;
}
