
import { NumberBaseConverter } from "@/components/calculators/number-base-converter";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Number Base Converter',
    description: 'Convert numbers between different bases like binary, octal, decimal, and hexadecimal with this free online tool for programmers.'
};

export default function NumberBaseConverterPage() {
    return <NumberBaseConverter />;
}
