"use client"

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, History, Square, Waypoints } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CalcType = 'power' | 'root';

export function ExponentsCalculator() {
  const [base, setBase] = useState('2');
  const [exponent, setExponent] = useState('10');
  
  const [number, setNumber] = useState('64');
  const [rootDegree, setRootDegree] = useState('3');

  const [calcType, setCalcType] = useState<CalcType>('power');
  const [rootType, setRootType] = useState<'cube' | 'square' | 'nth'>('cube');
  
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const powerResult = useMemo(() => {
    const b = parseFloat(base);
    const exp = parseFloat(exponent);
    if (isNaN(b) || isNaN(exp)) return null;
    return Number(Math.pow(b, exp).toPrecision(15));
  }, [base, exponent]);

  const rootResult = useMemo(() => {
    const num = parseFloat(number);
    if (isNaN(num)) return null;

    let result;
    if (rootType === 'square') {
      if (num < 0) return "Invalid input for square root";
      result = Math.sqrt(num);
    } else if (rootType === 'cube') {
      result = Math.cbrt(num);
    } else {
      const degree = parseFloat(rootDegree);
      if (isNaN(degree) || degree === 0) return "Invalid root degree";
      if (num < 0 && degree % 2 === 0) return "Invalid input for even root";
      result = Math.pow(num, 1 / degree);
    }
    return Number(result.toPrecision(15));
  }, [number, rootDegree, rootType]);

  const result = calcType === 'power' ? powerResult : rootResult;
  
  const getExpression = useCallback(() => {
    if (calcType === 'power') {
      return `${base} ^ ${exponent}`;
    }
    switch (rootType) {
      case 'square': return `√(${number})`;
      case 'cube': return `∛(${number})`;
      case 'nth': return `${rootDegree}√(${number})`;
    }
  }, [calcType, base, exponent, number, rootDegree, rootType]);

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
        <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Square className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Exponents & Powers</CardTitle>
                    <CardDescription>Calculate powers and roots of numbers.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Tabs value={calcType} onValueChange={(v) => setCalcType(v as CalcType)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="power"><Square className="mr-2 h-4 w-4" /> Powers</TabsTrigger>
                    <TabsTrigger value="root"><Waypoints className="mr-2 h-4 w-4" /> Roots</TabsTrigger>
                </TabsList>
                <TabsContent value="power" className="pt-6 space-y-4">
                    <div>
                        <Label htmlFor="base">Base (x)</Label>
                        <Input id="base" type="number" value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. 2" className="text-lg" />
                    </div>
                    <div>
                        <Label htmlFor="exponent">Exponent (y)</Label>
                        <Input id="exponent" type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} placeholder="e.g. 10" className="text-lg" />
                    </div>
                </TabsContent>
                 <TabsContent value="root" className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Root Type</Label>
                        <Select value={rootType} onValueChange={(v: any) => setRootType(v)}>
                            <SelectTrigger className="text-lg h-11">
                                <SelectValue placeholder="Select root type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="square">Square Root (√x)</SelectItem>
                                <SelectItem value="cube">Cube Root (∛x)</SelectItem>
                                <SelectItem value="nth">Nth Root (ʸ√x)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="number">Number (x)</Label>
                        <Input id="number" type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 64" className="text-lg" />
                    </div>
                    {rootType === 'nth' && (
                         <div>
                            <Label htmlFor="rootDegree">Root Degree (y)</Label>
                            <Input id="rootDegree" type="number" value={rootDegree} onChange={(e) => setRootDegree(e.target.value)} placeholder="e.g. 3" className="text-lg" />
                        </div>
                    )}
                </TabsContent>
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
