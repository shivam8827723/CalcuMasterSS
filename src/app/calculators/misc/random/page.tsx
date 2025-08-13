
import { RandomNumberGenerator } from "@/components/calculators/random-number-generator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Random Number Generator',
    description: 'Generate a random number within a specified range (min and max). A useful tool for games, drawings, and more.'
};

export default function RandomNumberCalculatorPage() {
  return <RandomNumberGenerator />;
}
