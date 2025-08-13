
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { speedUnits } from "@/lib/converters-config";
import { Gauge } from "lucide-react";

export default function SpeedConverterPage() {
    return (
        <UnitConverter
            title="Speed Converter"
            description="Convert units of speed."
            icon={Gauge}
            units={speedUnits}
            initialFrom="km/h"
            initialTo="mph"
        />
    );
}

