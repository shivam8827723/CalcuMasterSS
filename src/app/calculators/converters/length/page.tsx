
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { lengthUnits } from "@/lib/converters-config";
import { Ruler } from "lucide-react";

export default function LengthConverterPage() {
    return (
        <UnitConverter
            title="Length Converter"
            description="Convert units of length."
            icon={Ruler}
            units={lengthUnits}
            initialFrom="m"
            initialTo="ft"
        />
    );
}

