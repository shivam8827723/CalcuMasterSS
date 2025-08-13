"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, History, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('2');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { interest, totalAmount } = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      return { interest: null, totalAmount: null };
    }
    
    const timeInYears = timeUnit === 'years' ? t : t / 12;
    const calculatedInterest = p * (r / 100) * timeInYears;
    const calculatedTotal = p + calculatedInterest;
    
    return { 
      interest: Number(calculatedInterest.toFixed(2)), 
      totalAmount: Number(calculatedTotal.toFixed(2))
    };

  }, [principal, rate, time, timeUnit]);

  const handleCopyToClipboard = () => {
    if (totalAmount !== null) {
      const textToCopy = `Total Amount: ₹${totalAmount.toLocaleString()}\nInterest: ₹${interest?.toLocaleString()}`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard!",
        description: `Results have been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if (totalAmount !== null && interest !== null) {
        const expression = `Interest for ₹${principal} at ${rate}% for ${time} ${timeUnit}`;
        addHistory({ expression, result: `₹${interest.toLocaleString()}` });
        toast({
            title: "Saved to history",
            description: `${expression} = ₹${interest.toLocaleString()}`,
        });
    }
  };

  const hasResult = interest !== null && totalAmount !== null;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Simple Interest Calculator</CardTitle>
                    <CardDescription>Calculate simple interest on a principal amount.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="principal">Principal Amount (₹)</Label>
                    <Input 
                        id="principal" 
                        type="number" 
                        value={principal} 
                        onChange={(e) => setPrincipal(e.target.value)} 
                        placeholder="e.g. 10000" 
                        className="text-lg"
                    />
                </div>
                <div>
                    <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                    <Input 
                        id="rate" 
                        type="number" 
                        value={rate} 
                        onChange={(e) => setRate(e.target.value)} 
                        placeholder="e.g. 5"
                        className="text-lg"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="time">Time Period</Label>
                        <Input 
                            id="time" 
                            type="number" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            placeholder="e.g. 2"
                            className="text-lg"
                        />
                    </div>
                    <div>
                        <Label>Unit</Label>
                        <Select value={timeUnit} onValueChange={(value: 'years' | 'months') => setTimeUnit(value)}>
                            <SelectTrigger className="text-lg h-11">
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="years">Years</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {hasResult && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                            <Label className="text-sm text-muted-foreground">Interest</Label>
                            <p className="text-3xl font-bold tracking-tight text-primary">
                                ₹{interest.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                            <Label className="text-sm text-muted-foreground">Total Amount</Label>
                            <p className="text-3xl font-bold tracking-tight text-primary">
                                ₹{totalAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </CardContent>
        {hasResult && (
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleAddToHistory}>
                    <History className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={handleCopyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Results
                </Button>
            </CardFooter>
        )}
        </Card>
    </div>
  );
}
