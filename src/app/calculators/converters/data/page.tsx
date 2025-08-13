
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { dataSizeUnits } from "@/lib/converters-config";
import { Binary } from "lucide-react";

export default function DataSizeConverterPage() {
    return (
        <UnitConverter
            title="Data Size Converter"
            description="Convert units of digital information."
            icon={Binary}
            units={dataSizeUnits}
            initialFrom="MB"
            initialTo="MiB"
        />
    );
}

