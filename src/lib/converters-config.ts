import type { Unit } from '@/components/calculators/converters/unit-converter';

// Base units: meter, gram, celsius, m/s, liter, sq-meter, byte

export const lengthUnits: Unit[] = [
  { name: 'Meter', symbol: 'm', factor: 1 },
  { name: 'Kilometer', symbol: 'km', factor: 1000 },
  { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { name: 'Mile', symbol: 'mi', factor: 1609.34 },
  { name: 'Yard', symbol: 'yd', factor: 0.9144 },
  { name: 'Foot', symbol: 'ft', factor: 0.3048 },
  { name: 'Inch', symbol: 'in', factor: 0.0254 },
];

export const weightUnits: Unit[] = [
  { name: 'Gram', symbol: 'g', factor: 1 },
  { name: 'Kilogram', symbol: 'kg', factor: 1000 },
  { name: 'Milligram', symbol: 'mg', factor: 0.001 },
  { name: 'Tonne', symbol: 't', factor: 1_000_000 },
  { name: 'Pound', symbol: 'lb', factor: 453.592 },
  { name: 'Ounce', symbol: 'oz', factor: 28.3495 },
];

export const temperatureUnits: Unit[] = [
  { name: 'Celsius', symbol: '°C', factor: 1, transformTo: (c) => c, transformFrom: (c) => c },
  { name: 'Fahrenheit', symbol: '°F', factor: 1, transformTo: (f) => (f - 32) * 5/9, transformFrom: (c) => (c * 9/5) + 32 },
  { name: 'Kelvin', symbol: 'K', factor: 1, transformTo: (k) => k - 273.15, transformFrom: (c) => c + 273.15 },
];

export const speedUnits: Unit[] = [
    { name: 'Meters/second', symbol: 'm/s', factor: 1 },
    { name: 'Kilometers/hour', symbol: 'km/h', factor: 0.277778 },
    { name: 'Miles/hour', symbol: 'mph', factor: 0.44704 },
    { name: 'Feet/second', symbol: 'ft/s', factor: 0.3048 },
    { name: 'Knot', symbol: 'kn', factor: 0.514444 },
];

export const volumeUnits: Unit[] = [
    { name: 'Liter', symbol: 'L', factor: 1 },
    { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
    { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
    { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
    { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
    { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
    { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
    { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
];

export const areaUnits: Unit[] = [
    { name: 'Square Meter', symbol: 'm²', factor: 1 },
    { name: 'Square Kilometer', symbol: 'km²', factor: 1_000_000 },
    { name: 'Square Mile', symbol: 'mi²', factor: 2_589_990 },
    { name: 'Hectare', symbol: 'ha', factor: 10000 },
    { name: 'Acre', symbol: 'acre', factor: 4046.86 },
    { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
    { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
];

export const dataSizeUnits: Unit[] = [
    { name: 'Byte', symbol: 'B', factor: 1 },
    { name: 'Kilobyte', symbol: 'KB', factor: 1024 },
    { name: 'Megabyte', symbol: 'MB', factor: Math.pow(1024, 2) },
    { name: 'Gigabyte', symbol: 'GB', factor: Math.pow(1024, 3) },
    { name: 'Terabyte', symbol: 'TB', factor: Math.pow(1024, 4) },
    { name: 'Petabyte', symbol: 'PB', factor: Math.pow(1024, 5) },
    { name: 'Bit', symbol: 'bit', factor: 0.125 },
    { name: 'Kibibyte', symbol: 'KiB', factor: 1024 },
    { name: 'Mebibyte', symbol: 'MiB', factor: Math.pow(1024, 2) },
];
