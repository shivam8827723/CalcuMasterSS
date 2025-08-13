
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { areaUnits } from "@/lib/converters-config";
import { RectangleHorizontal } from "lucide-react";

export default function AreaConverterPage() {
    return (
        <UnitConverter
            title="Area Converter"
            description="Convert units of area."
            icon={RectangleHorizontal}
            units={areaUnits}
            initialFrom="m²"
            initialTo="ft²"
        />
    );
}

