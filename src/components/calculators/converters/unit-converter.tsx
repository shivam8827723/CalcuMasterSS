"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, History, ArrowRightLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import type { LucideIcon } from 'lucide-react';

export type Unit = {
  name: string;
  symbol: string;
  factor: number; // Factor relative to a base unit
  transformTo?: (value: number) => number;
  transformFrom?: (value: number) => number;
};

export type UnitConverterProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  units: Unit[];
  initialFrom: string; // symbol
  initialTo: string; // symbol
};

export function UnitConverter({ title, description, icon: Icon, units, initialFrom, initialTo }: UnitConverterProps) {
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState(initialFrom);
  const [toUnit, setToUnit] = useState(initialTo);
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return null;

    const from = units.find(u => u.symbol === fromUnit);
    const to = units.find(u => u.symbol === toUnit);

    if (!from || !to) return null;

    let baseValue;
    // Convert input amount to base unit
    if (from.transformTo) {
      baseValue = from.transformTo(numAmount);
    } else {
      baseValue = numAmount * from.factor;
    }

    let result;
    // Convert base unit value to output amount
    if (to.transformFrom) {
        result = to.transformFrom(baseValue);
    } else {
        result = baseValue / to.factor;
    }
    
    return Number(result.toPrecision(10));
  }, [amount, fromUnit, toUnit, units]);

  const exchangeRateInfo = useMemo(() => {
    const from = units.find(u => u.symbol === fromUnit);
    const to = units.find(u => u.symbol === toUnit);

    if (!from || !to) return '';
    
    let baseValue;
    if (from.transformTo) {
      baseValue = from.transformTo(1);
    } else {
      baseValue = 1 * from.factor;
    }

    let rate;
    if (to.transformFrom) {
      rate = to.transformFrom(baseValue);
    } else {
      rate = baseValue / to.factor;
    }

    return `1 ${from.symbol} = ${Number(rate.toPrecision(6))} ${to.symbol}`;
  }, [fromUnit, toUnit, units]);


  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopyToClipboard = () => {
    if (convertedAmount !== null) {
      navigator.clipboard.writeText(convertedAmount.toString());
      toast({
        title: "Copied to clipboard!",
        description: `Value ${convertedAmount.toLocaleString()} has been copied.`,
      });
    }
  };

  const handleAddToHistory = () => {
    if (convertedAmount !== null) {
      const expression = `${amount} ${fromUnit} to ${toUnit}`;
      const result = `${convertedAmount.toLocaleString()} ${toUnit}`;
      addHistory({ expression, result });
      toast({
        title: "Saved to history",
        description: `${expression} = ${result}`,
      });
    }
  };

  const hasResult = convertedAmount !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1"
                className="text-lg"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>From</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(u => <SelectItem key={u.symbol} value={u.symbol}>{u.name} ({u.symbol})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSwapUnits} className="h-11 w-11">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <Label>To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(u => <SelectItem key={u.symbol} value={u.symbol}>{u.name} ({u.symbol})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {hasResult && (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border text-center">
                <Label className="text-sm text-muted-foreground">{amount} {fromUnit} is equal to</Label>
                <p className="text-4xl font-bold tracking-tight text-primary">
                  {convertedAmount.toLocaleString()} <span className="text-2xl font-medium text-muted-foreground">{toUnit}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">{exchangeRateInfo}</p>
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
