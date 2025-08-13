"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, History, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function PercentageCalculator() {
  const [percentage, setPercentage] = useState('20');
  const [baseValue, setBaseValue] = useState('150');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const result = useMemo(() => {
    const p = parseFloat(percentage);
    const b = parseFloat(baseValue);

    if (isNaN(p) || isNaN(b)) {
      return null;
    }
    
    const calculatedResult = (p / 100) * b;
    return Number(calculatedResult.toPrecision(15));

  }, [percentage, baseValue]);

  const handleCopyToClipboard = () => {
    if (result !== null && typeof result === 'number') {
      navigator.clipboard.writeText(result.toString());
      toast({
        title: "Copied to clipboard!",
        description: `Result ${result.toLocaleString()} has been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if (result !== null && typeof result === 'number') {
        const expression = `${percentage}% of ${baseValue}`;
        addHistory({ expression, result: result.toLocaleString() });
        toast({
            title: "Saved to history",
            description: `${expression} = ${result.toLocaleString()}`,
        });
    }
  };

  const hasResult = result !== null;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-md w-full mx-auto">
        <CardHeader>
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Percent className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Percentage Calculator</CardTitle>
                    <CardDescription>Calculate percentages of numbers.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="percentage">Percentage</Label>
                    <div className="relative">
                        <Input 
                            id="percentage" 
                            type="number" 
                            value={percentage} 
                            onChange={(e) => setPercentage(e.target.value)} 
                            placeholder="e.g. 20" 
                            className="pl-8 text-lg"
                        />
                        <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="baseValue">Base Value</Label>
                    <Input 
                        id="baseValue" 
                        type="number" 
                        value={baseValue} 
                        onChange={(e) => setBaseValue(e.target.value)} 
                        placeholder="e.g. 150"
                        className="text-lg"
                    />
                </div>
            </div>

            {hasResult && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                        <Label className="text-sm text-muted-foreground">{percentage || 0}% of {baseValue || 0} is</Label>
                        <p className="text-4xl font-bold text-center tracking-tight text-primary">
                            {result.toLocaleString()}
                        </p>
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
                    <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
            </CardFooter>
        )}
        </Card>
    </div>
  );
}
