
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { volumeUnits } from "@/lib/converters-config";
import { Container } from "lucide-react";

export default function VolumeConverterPage() {
    return (
        <UnitConverter
            title="Volume Converter"
            description="Convert units of volume."
            icon={Container}
            units={volumeUnits}
            initialFrom="L"
            initialTo="gal"
        />
    );
}

