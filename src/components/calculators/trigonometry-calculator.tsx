"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table';
import { Copy, History, Sigma } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '../ui/separator';

type TrigResult = {
    sin: number | null;
    cos: number | null;
    tan: number | null;
    csc: number | null;
    sec: number | null;
    cot: number | null;
};

export function TrigonometryCalculator() {
  const [angle, setAngle] = useState('45');
  const [unit, setUnit] = useState<'degrees' | 'radians'>('degrees');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const results: TrigResult = useMemo(() => {
    const numAngle = parseFloat(angle);
    if (isNaN(numAngle)) {
      return { sin: null, cos: null, tan: null, csc: null, sec: null, cot: null };
    }

    const angleInRadians = unit === 'degrees' ? numAngle * (Math.PI / 180) : numAngle;

    const sin = Math.sin(angleInRadians);
    const cos = Math.cos(angleInRadians);
    const tan = Math.tan(angleInRadians);
    
    // Handle cases where tan is infinite
    const nearPiOver2 = Math.abs(Math.cos(angleInRadians)) < 1e-15;

    return {
      sin: sin,
      cos: cos,
      tan: nearPiOver2 ? Infinity : tan,
      csc: sin !== 0 ? 1 / sin : Infinity,
      sec: cos !== 0 ? 1 / cos : Infinity,
      cot: tan !== 0 && !nearPiOver2 ? 1 / tan : nearPiOver2 ? 0 : Infinity,
    };
  }, [angle, unit]);
  
  const formatResult = (value: number | null) => {
      if (value === null) return '-';
      if (!isFinite(value)) return '∞';
      if (Math.abs(value) < 1e-14) return '0';
      return value.toPrecision(10);
  }

  const handleCopyToClipboard = (value: number | null) => {
    if (value !== null && isFinite(value)) {
      navigator.clipboard.writeText(formatResult(value));
      toast({
        title: "Copied to clipboard!",
        description: `Value ${formatResult(value)} has been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if(results.sin !== null) {
        const expression = `Trig(${angle}${unit === 'degrees' ? '°' : 'rad'})`;
        const resultSummary = `sin=${formatResult(results.sin)}, cos=${formatResult(results.cos)}`;
        addHistory({ expression, result: resultSummary });
        toast({
            title: "Saved to history",
            description: `${expression}`,
        });
    }
  };

  const hasResult = results.sin !== null;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-lg w-full mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Sigma className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Trigonometry Calculator</CardTitle>
                        <CardDescription>Calculate trigonometric functions for a given angle.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="angle">Angle</Label>
                        <Input 
                            id="angle"
                            type="number" 
                            value={angle} 
                            onChange={(e) => setAngle(e.target.value)} 
                            placeholder="e.g. 45"
                            className="text-lg"
                        />
                    </div>
                    <div>
                        <Label>Unit</Label>
                        <RadioGroup 
                            value={unit} 
                            onValueChange={(value: 'degrees' | 'radians') => setUnit(value)}
                            className="flex items-center space-x-4 pt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="degrees" id="degrees" />
                                <Label htmlFor="degrees">Degrees</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="radians" id="radians" />
                                <Label htmlFor="radians">Radians</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                 <Separator />
                {hasResult && (
                     <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Function</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(results).map(([func, value]) => (
                                    <TableRow key={func}>
                                        <TableCell className="font-medium uppercase">{func}</TableCell>
                                        <TableCell className="text-right font-mono text-base">{formatResult(value)}</TableCell>
                                        <TableCell className="text-right w-12 p-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyToClipboard(value)} disabled={!isFinite(value ?? NaN)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

            </CardContent>
            {hasResult && (
                <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={handleAddToHistory}>
                        <History className="mr-2 h-4 w-4" /> Save to History
                    </Button>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
