
import { FuelEfficiencyCalculator } from "@/components/calculators/fuel-efficiency-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Fuel Efficiency Calculator',
    description: 'Calculate your vehicle\'s fuel efficiency (e.g., km/L or MPG) and the cost of a trip.'
};

export default function FuelCalculatorPage() {
  return <FuelEfficiencyCalculator />;
}
