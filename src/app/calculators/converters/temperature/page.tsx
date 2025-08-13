
"use client"
import { UnitConverter } from "@/components/calculators/converters/unit-converter";
import { temperatureUnits } from "@/lib/converters-config";
import { Thermometer } from "lucide-react";

export default function TemperatureConverterPage() {
    return (
        <UnitConverter
            title="Temperature Converter"
            description="Convert between Celsius, Fahrenheit, and Kelvin."
            icon={Thermometer}
            units={temperatureUnits}
            initialFrom="°C"
            initialTo="°F"
        />
    );
}

