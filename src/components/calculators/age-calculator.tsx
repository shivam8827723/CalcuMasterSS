"use client"

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, History, PersonStanding } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, differenceInWeeks, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function AgeCalculator() {
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const { addHistory } = useHistory();

  useEffect(() => {
    // Initialize date on the client to avoid hydration mismatch
    setDob(new Date(2000, 0, 1));
  }, []);

  const age = useMemo(() => {
    if (!dob) return null;
    
    const now = new Date();
    if (dob > now) return { error: "Date of birth cannot be in the future." };
    
    const years = differenceInYears(now, dob);
    const pastYearDate = addYears(dob, years);
    const months = differenceInMonths(now, pastYearDate);
    const pastMonthDate = addMonths(pastYearDate, months);
    const days = differenceInDays(now, pastMonthDate);

    const totalWeeks = differenceInWeeks(now, dob);
    const totalDays = differenceInDays(now, dob);
    const totalHours = differenceInHours(now, dob);
    const totalMinutes = differenceInMinutes(now, dob);
    const totalSeconds = differenceInSeconds(now, dob);

    return {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    };
  }, [dob]);

  const handleAddToHistory = () => {
    if (dob && age && !age.error) {
      const expression = `Age for DOB: ${format(dob, 'PPP')}`;
      const result = `${age.years}Y ${age.months}M ${age.days}D`;
      addHistory({ expression, result });
      toast({
          title: "Saved to history",
          description: `${expression}`,
      });
    }
  };

  const hasResult = age && !age.error;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-lg w-full mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <PersonStanding className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Age Calculator</CardTitle>
                        <CardDescription>Calculate your age based on your date of birth.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="dob"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal text-lg h-11",
                                !dob && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={dob}
                            onSelect={setDob}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                
                {age?.error && <p className="text-destructive text-center">{age.error}</p>}

                {hasResult && (
                    <div className="space-y-4 pt-4">
                        <Separator />
                        <div className="text-center">
                            <Label className="text-muted-foreground">Your Age</Label>
                            <div className="text-4xl font-bold tracking-tight text-primary">
                                <span className="text-5xl">{age.years}</span> years, {' '}
                                <span className="text-5xl">{age.months}</span> months, {'&'} {' '}
                                <span className="text-5xl">{age.days}</span> days
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                          {[
                            { label: 'Total Months', value: age.totalMonths },
                            { label: 'Total Weeks', value: age.totalWeeks },
                            { label: 'Total Days', value: age.totalDays },
                            { label: 'Total Hours', value: age.totalHours },
                            { label: 'Total Minutes', value: age.totalMinutes },
                            { label: 'Total Seconds', value: age.totalSeconds },
                          ].map(item => (
                            <div key={item.label} className="p-3 rounded-lg bg-muted border">
                              <p className="text-sm text-muted-foreground">{item.label}</p>
                              <p className="text-xl font-semibold">{item.value.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {hasResult && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleAddToHistory}>
                        <History className="mr-2 h-4 w-4" /> Save to History
                    </Button>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
