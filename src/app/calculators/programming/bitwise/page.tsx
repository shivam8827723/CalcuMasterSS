
import { BitwiseOperationsCalculator } from "@/components/calculators/bitwise-operations-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Bitwise Operations Calculator',
    description: 'Perform bitwise operations like AND, OR, XOR, NOT, and bit shifts with this online calculator for programmers.'
};

export default function BitwiseOperationsPage() {
    return <BitwiseOperationsCalculator />;
}
