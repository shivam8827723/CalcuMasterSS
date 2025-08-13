
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { weightUnits } from "@/lib/converters-config";
import { Weight } from "lucide-react";

export default function WeightConverterPage() {
    return (
        <UnitConverter
            title="Weight Converter"
            description="Convert units of mass and weight."
            icon={Weight}
            units={weightUnits}
            initialFrom="kg"
            initialTo="lb"
        />
    );
}

