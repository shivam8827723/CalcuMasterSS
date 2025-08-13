"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Timer, Clock, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatTime = (time: number) => {
  const milliseconds = Math.floor((time % 1000) / 10);
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor(time / (1000 * 60 * 60));

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(2, '0')
  };
};

const TimeDisplay = ({ time, showMs = true }: { time: number, showMs?: boolean }) => {
    const { hours, minutes, seconds, milliseconds } = formatTime(time);
    return (
        <div className="font-mono text-center">
            <span className="text-6xl md:text-7xl font-bold tracking-tighter text-primary">{hours}</span>
            <span className="text-4xl md:text-5xl font-semibold text-muted-foreground mx-1">:</span>
            <span className="text-6xl md:text-7xl font-bold tracking-tighter text-primary">{minutes}</span>
            <span className="text-4xl md:text-5xl font-semibold text-muted-foreground mx-1">:</span>
            <span className="text-6xl md:text-7xl font-bold tracking-tighter text-primary">{seconds}</span>
            {showMs && (
                <>
                    <span className="text-4xl md:text-5xl font-semibold text-muted-foreground mx-1">.</span>
                    <span className="text-6xl md:text-7xl font-bold tracking-tighter text-primary w-24">{milliseconds}</span>
                </>
            )}
        </div>
    );
};

const StopwatchTab = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };
    const handleLap = () => {
        if (isRunning) {
            setLaps(prev => [...prev, time]);
        }
    };
    
    return (
        <div className="flex flex-col items-center gap-8 py-6">
            <TimeDisplay time={time} />
            <div className="flex gap-4">
                <Button size="lg" className="w-28" onClick={handleReset} variant="outline" disabled={time === 0 && !isRunning}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button size="lg" className="w-36" onClick={handleStartPause}>
                    {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                 <Button size="lg" className="w-28" onClick={handleLap} variant="outline" disabled={!isRunning}>
                    <Flag className="mr-2 h-4 w-4" /> Lap
                </Button>
            </div>
            {laps.length > 0 && (
                 <ScrollArea className="h-40 w-full max-w-sm rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Laps</h4>
                        <div className="space-y-2">
                        {laps.map((lap, index) => {
                            const prevLap = index > 0 ? laps[index - 1] : 0;
                            const lapTime = lap - prevLap;
                            const { hours, minutes, seconds, milliseconds } = formatTime(lapTime);
                            return (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Lap {laps.length - index}</span>
                                    <span className="font-mono">{`${hours}:${minutes}:${seconds}.${milliseconds}`}</span>
                                </div>
                            );
                        }).reverse()}
                        </div>
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

const TimerTab = () => {
    const [initialTime, setInitialTime] = useState(60000); // 1 minute
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInputs, setTimerInputs] = useState({ h: '0', m: '1', s: '0' });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3');
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isTimerRunning && timeRemaining > 0) {
          interval = setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1000);
          }, 1000);
        } else if (timeRemaining <= 0 && isTimerRunning) {
          setIsTimerRunning(false);
          if (audioRef.current) {
            audioRef.current.play();
          }
        }
        return () => {
          if (interval) clearInterval(interval);
        };
      }, [isTimerRunning, timeRemaining]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, unit: 'h' | 'm' | 's') => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const newInputs = { ...timerInputs, [unit]: value };
        setTimerInputs(newInputs);

        const h = parseInt(newInputs.h || '0') * 3600000;
        const m = parseInt(newInputs.m || '0') * 60000;
        const s = parseInt(newInputs.s || '0') * 1000;
        const newInitialTime = h + m + s;

        setInitialTime(newInitialTime);
        if (!isTimerRunning) {
            setTimeRemaining(newInitialTime);
        }
    };
    
    const handleStartPause = () => setIsTimerRunning(!isTimerRunning);
    const handleReset = () => {
        setIsTimerRunning(false);
        setTimeRemaining(initialTime);
    };

    const progress = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0;

    return (
        <div className="flex flex-col items-center gap-8 py-6">
            <div className="relative h-64 w-64">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle className="stroke-current text-muted" strokeWidth="5" cx="50" cy="50" r="45" fill="transparent"></circle>
                    <circle 
                        className="stroke-current text-primary transition-all duration-1000 ease-linear" 
                        strokeWidth="5" 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="transparent" 
                        strokeDasharray="282.74" 
                        strokeDashoffset={282.74 - (progress / 100) * 282.74}
                        transform="rotate(-90 50 50)"
                    ></circle>
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <TimeDisplay time={timeRemaining} showMs={false} />
                </div>
            </div>
             <div className={cn("grid grid-cols-3 gap-2", { 'opacity-50 pointer-events-none': isTimerRunning })}>
                <div>
                    <Label htmlFor="hours">Hours</Label>
                    <Input id="hours" type="text" value={timerInputs.h} onChange={(e) => handleInputChange(e, 'h')} className="text-lg text-center" disabled={isTimerRunning} />
                </div>
                 <div>
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input id="minutes" type="text" value={timerInputs.m} onChange={(e) => handleInputChange(e, 'm')} className="text-lg text-center" disabled={isTimerRunning} />
                </div>
                 <div>
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input id="seconds" type="text" value={timerInputs.s} onChange={(e) => handleInputChange(e, 's')} className="text-lg text-center" disabled={isTimerRunning} />
                </div>
            </div>
             <div className="flex gap-4">
                <Button size="lg" className="w-28" onClick={handleReset} variant="outline" disabled={timeRemaining === initialTime && !isTimerRunning}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button size="lg" className="w-36" onClick={handleStartPause} disabled={initialTime === 0}>
                    {isTimerRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isTimerRunning ? 'Pause' : 'Start'}
                </Button>
            </div>
        </div>
    );
}


export function TimerStopwatchCalculator() {
  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-xl w-full mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Timer className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Timer & Stopwatch</CardTitle>
                        <CardDescription>Measure time with precision using the stopwatch and countdown timer.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="stopwatch" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="stopwatch"><Clock className="mr-2 h-4 w-4" /> Stopwatch</TabsTrigger>
                        <TabsTrigger value="timer"><Timer className="mr-2 h-4 w-4" /> Timer</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stopwatch">
                        <StopwatchTab />
                    </TabsContent>
                    <TabsContent value="timer">
                       <TimerTab />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
