
import {
  Calculator,
  FlaskConical,
  Landmark,
  CalendarClock,
  Replace,
  Code,
  HeartPulse,
  AreaChart,
  Sparkles,
  type LucideIcon,
  Sigma,
  Pi,
  Percent,
  TrendingUp,
  Square,
  Clock,
  Thermometer,
  Gauge,
  Container,
  RectangleHorizontal,
  Binary,
  Weight,
  Ruler,
  Shuffle,
  Tag,
  Fuel,
  GraduationCap,
  Timer,
  PersonStanding,
  Heart,
  Flame,
  LineChart,
  Receipt,
} from 'lucide-react';

export type CalculatorInfo = {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
};

export type CalculatorCategory = {
  name: string;
  icon: LucideIcon;
  calculators: CalculatorInfo[];
};

export const calculatorCategories: CalculatorCategory[] = [
  {
    name: 'Basic',
    icon: Calculator,
    calculators: [
      {
        name: 'Scientific Calculator',
        path: '/calculators/basic',
        icon: FlaskConical,
        description: 'Perform basic and advanced scientific calculations.',
      },
      {
        name: 'Percentage',
        path: '/calculators/basic/percentage',
        icon: Percent,
        description: 'Calculate percentages, tips, and discounts.',
      },
      {
        name: 'Simple Interest',
        path: '/calculators/basic/simple-interest',
        icon: TrendingUp,
        description: 'Calculate simple interest on a principal amount.',
      },
    ],
  },
  {
    name: 'Scientific',
    icon: FlaskConical,
    calculators: [
      { name: 'Trigonometry', path: '/calculators/scientific/trigonometry', icon: Sigma, description: 'Sine, cosine, tangent, and more.' },
      { name: 'Logarithmic', path: '/calculators/scientific/logarithmic', icon: Pi, description: 'Calculate logarithms to various bases.' },
      { name: 'Exponents & Powers', path: '/calculators/scientific/exponents', icon: Square, description: 'Calculate powers and roots.' },
    ],
  },
  {
    name: 'Financial',
    icon: Landmark,
    calculators: [
        { name: 'Loan/EMI', path: '/calculators/financial/loan', icon: Percent, description: 'Calculate Equated Monthly Installments.' },
        { name: 'Compound Interest', path: '/calculators/financial/compound-interest', icon: TrendingUp, description: 'Calculate compound interest.' },
        { name: 'Sales Tax', path: '/calculators/financial/sales-tax', icon: Receipt, description: 'Calculate sales tax and final price.' },
        { name: 'Currency Converter', path: '/calculators/financial/currency', icon: Replace, description: 'Convert between different currencies.' },
    ],
  },
  {
    name: 'Date & Time',
    icon: CalendarClock,
    calculators: [
        { name: 'Age Calculator', path: '/calculators/date-time/age', icon: PersonStanding, description: 'Calculate age from date of birth.'},
        { name: 'Date Difference', path: '/calculators/date-time/difference', icon: Clock, description: 'Find the duration between two dates.'},
        { name: 'Timer & Stopwatch', path: '/calculators/date-time/timer', icon: Timer, description: 'Measure time intervals.'}
    ],
  },
  {
    name: 'Unit Converters',
    icon: Replace,
    calculators: [
        { name: 'Length', path: '/calculators/converters/length', icon: Ruler, description: 'Convert units of length.'},
        { name: 'Weight', path: '/calculators/converters/weight', icon: Weight, description: 'Convert units of weight.'},
        { name: 'Temperature', path: '/calculators/converters/temperature', icon: Thermometer, description: 'Convert units of temperature.'},
        { name: 'Speed', path: '/calculators/converters/speed', icon: Gauge, description: 'Convert units of speed.'},
        { name: 'Volume', path: '/calculators/converters/volume', icon: Container, description: 'Convert units of volume.'},
        { name: 'Area', path: '/calculators/converters/area', icon: RectangleHorizontal, description: 'Convert units of area.'},
        { name: 'Data Size', path: '/calculators/converters/data', icon: Binary, description: 'Convert units of digital information.'},
    ],
  },
  {
    name: 'Programming',
    icon: Code,
    calculators: [
      { name: 'Number Base', path: '/calculators/programming/base-converter', icon: Replace, description: 'Convert numbers between bases.'},
      { name: 'Bitwise Operations', path: '/calculators/programming/bitwise', icon: Binary, description: 'Perform bitwise operations.'},
    ],
  },
  {
    name: 'Health & Fitness',
    icon: HeartPulse,
    calculators: [
      { name: 'BMI Calculator', path: '/calculators/health/bmi', icon: PersonStanding, description: 'Calculate Body Mass Index.' },
      { name: 'BMR Calculator', path: '/calculators/health/bmr', icon: Flame, description: 'Calculate Basal Metabolic Rate.' },
      { name: 'Heart Rate', path: '/calculators/health/heart-rate', icon: Heart, description: 'Calculate target heart rate zones.' },
    ],
  },
  {
    name: 'Statistical',
    icon: AreaChart,
    calculators: [
        { name: 'Averages', path: '/calculators/statistical/averages', icon: LineChart, description: 'Calculate mean, median, and mode.' },
        { name: 'Probability', path: '/calculators/statistical/probability', icon: Sigma, description: 'Calculate probabilities.' },
    ],
  },
  {
    name: 'Miscellaneous',
    icon: Sparkles,
    calculators: [
        { name: 'Discount', path: '/calculators/misc/discount', icon: Tag, description: 'Calculate discounts and final prices.' },
        { name: 'Tip Calculator', path: '/calculators/misc/tip', icon: Sparkles, description: 'Calculate tips for services.' },
        { name: 'Fuel Efficiency', path: '/calculators/misc/fuel', icon: Fuel, description: 'Calculate fuel efficiency.' },
        { name: 'GPA Calculator', path: '/calculators/misc/gpa', icon: GraduationCap, description: 'Calculate Grade Point Average.' },
        { name: 'Random Number', path: '/calculators/misc/random', icon: Shuffle, description: 'Generate random numbers.' },
    ],
  },

];
