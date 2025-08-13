"use client"

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, History, Pi } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

type LogType = 'common' | 'natural' | 'custom';

export function LogarithmicCalculator() {
  const [number, setNumber] = useState('100');
  const [base, setBase] = useState('10');
  const [logType, setLogType] = useState<LogType>('common');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const handleTabChange = (value: string) => {
    const type = value as LogType;
    setLogType(type);
    if (type === 'common') setBase('10');
    if (type === 'natural') setBase(String(Math.E));
  }

  const result = useMemo(() => {
    const num = parseFloat(number);
    const b = parseFloat(base);

    if (isNaN(num) || isNaN(b)) return null;
    if (num <= 0) return 'Invalid number';
    if (b <= 0 || b === 1) return 'Invalid base';
    
    const calculatedResult = Math.log(num) / Math.log(b);
    return Number(calculatedResult.toPrecision(15));
  }, [number, base]);

  const getExpression = useCallback(() => {
    switch(logType) {
        case 'common': return `log(${number})`;
        case 'natural': return `ln(${number})`;
        case 'custom': return `log base ${base} of ${number}`;
        default: return '';
    }
  }, [number, base, logType]);

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
        const expression = getExpression();
        addHistory({ expression, result: result.toLocaleString() });
        toast({
            title: "Saved to history",
            description: `${expression} = ${result.toLocaleString()}`,
        });
    }
  };
  
  const hasResult = result !== null;
  const isError = typeof result === 'string';

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-md w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Pi className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Logarithmic Calculator</CardTitle>
                    <CardDescription>Calculate logarithms with different bases.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Tabs value={logType} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="common">log (base 10)</TabsTrigger>
                    <TabsTrigger value="natural">ln (base e)</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <div className="pt-6 space-y-4">
                    <div>
                        <Label htmlFor="number">Number</Label>
                        <Input 
                            id="number"
                            type="number" 
                            value={number} 
                            onChange={(e) => setNumber(e.target.value)} 
                            placeholder="e.g. 100"
                            className="text-lg"
                        />
                    </div>
                    <TabsContent value="custom" forceMount className="p-0 m-0">
                        <div className={`space-y-4 ${logType !== 'custom' ? 'hidden' : ''}`}>
                           <Label htmlFor="base">Base</Label>
                           <Input
                               id="base"
                               type="number"
                               value={base}
                               onChange={(e) => setBase(e.target.value)}
                               placeholder="e.g. 2"
                               className="text-lg"
                           />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {hasResult && (
                <div className="space-y-4">
                    <Separator />
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                        <Label className="text-sm text-muted-foreground">{getExpression()} is</Label>
                        {isError ? (
                             <p className="text-2xl font-bold text-center tracking-tight text-destructive">
                                {result}
                            </p>
                        ) : (
                            <p className="text-4xl font-bold text-center tracking-tight text-primary">
                                {typeof result === 'number' ? result.toLocaleString() : ''}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </CardContent>
        {hasResult && !isError && (
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
