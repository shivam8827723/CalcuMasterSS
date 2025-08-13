
import { TimerStopwatchCalculator } from "@/components/calculators/timer-stopwatch-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Timer & Stopwatch',
    description: 'Use our online timer and stopwatch to measure time with precision. Features laps, countdown, and alarm.'
};

export default function TimerStopwatchPage() {
    return <TimerStopwatchCalculator />;
}
