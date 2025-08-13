"use client"

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, History, ArrowRightLeft, Clock } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, differenceInWeeks, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const { addHistory } = useHistory();

  useEffect(() => {
    // Initialize dates on the client to avoid hydration mismatch
    setStartDate(new Date(2020, 0, 1));
    setEndDate(new Date());
  }, []);

  const duration = useMemo(() => {
    if (!startDate || !endDate) return null;
    
    const [from, to] = startDate > endDate ? [endDate, startDate] : [startDate, endDate];

    const years = differenceInYears(to, from);
    const pastYearDate = addYears(from, years);
    const months = differenceInMonths(to, pastYearDate);
    const pastMonthDate = addMonths(pastYearDate, months);
    const days = differenceInDays(to, pastMonthDate);

    const totalWeeks = differenceInWeeks(to, from);
    const totalDays = differenceInDays(to, from);
    const totalHours = differenceInHours(to, from);
    const totalMinutes = differenceInMinutes(to, from);
    const totalSeconds = differenceInSeconds(to, from);

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
  }, [startDate, endDate]);

  const handleSwapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };
  
  const handleAddToHistory = () => {
    if (startDate && endDate && duration) {
      const expression = `Duration from ${format(startDate, 'PPP')} to ${format(endDate, 'PPP')}`;
      const result = `${duration.years}Y ${duration.months}M ${duration.days}D`;
      addHistory({ expression, result });
      toast({
          title: "Saved to history",
          description: `${expression}`,
      });
    }
  };

  const hasResult = duration !== null;

  const DatePicker = ({ date, setDate, label }: { date: Date | undefined, setDate: (date: Date | undefined) => void, label: string }) => (
      <div className="space-y-2">
          <Label>{label}</Label>
          <Popover>
              <PopoverTrigger asChild>
              <Button
                  variant={"outline"}
                  className={cn(
                      "w-full justify-start text-left font-normal text-lg h-11",
                      !date && "text-muted-foreground"
                  )}
              >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
              <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 50}
              />
              </PopoverContent>
          </Popover>
      </div>
  );

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-xl w-full mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Date Difference Calculator</CardTitle>
                        <CardDescription>Calculate the duration between two dates.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <DatePicker date={startDate} setDate={setStartDate} label="From" />
                    </div>
                     <Button variant="ghost" size="icon" onClick={handleSwapDates} className="self-end h-11 w-11">
                        <ArrowRightLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                         <DatePicker date={endDate} setDate={setEndDate} label="To" />
                    </div>
                </div>
                
                {hasResult && (
                    <div className="space-y-4 pt-4">
                        <Separator />
                        <div className="text-center">
                            <Label className="text-muted-foreground">Difference</Label>
                            <div className="text-4xl font-bold tracking-tight text-primary">
                                <span className="text-5xl">{duration.years}</span> years, {' '}
                                <span className="text-5xl">{duration.months}</span> months, {'&'} {' '}
                                <span className="text-5xl">{duration.days}</span> days
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                          {[
                            { label: 'Total Months', value: duration.totalMonths },
                            { label: 'Total Weeks', value: duration.totalWeeks },
                            { label: 'Total Days', value: duration.totalDays },
                            { label: 'Total Hours', value: duration.totalHours },
                            { label: 'Total Minutes', value: duration.totalMinutes },
                            { label: 'Total Seconds', value: duration.totalSeconds },
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
