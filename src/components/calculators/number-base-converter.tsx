"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, History, ArrowRightLeft, Replace } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

const bases = [
  { name: 'Binary', value: 2, validation: /^[01]+$/ },
  { name: 'Octal', value: 8, validation: /^[0-7]+$/ },
  { name: 'Decimal', value: 10, validation: /^[0-9]+$/ },
  { name: 'Hexadecimal', value: 16, validation: /^[0-9a-fA-F]+$/ },
];

export function NumberBaseConverter() {
  const [value, setValue] = useState('1010');
  const [fromBase, setFromBase] = useState('2');
  const [toBase, setToBase] = useState('10');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const convertedValue = useMemo(() => {
    const from = bases.find(b => b.value === parseInt(fromBase));
    if (!from || (value && !from.validation.test(value))) {
      setError(`Invalid value for base ${fromBase}`);
      return null;
    }
    setError('');

    if (value === '') return '';

    try {
      const decimalValue = parseInt(value, parseInt(fromBase));
      if (isNaN(decimalValue)) return null;
      return decimalValue.toString(parseInt(toBase)).toUpperCase();
    } catch (e) {
      setError('Conversion error');
      return null;
    }
  }, [value, fromBase, toBase]);

  const handleSwapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    if(convertedValue) {
      setValue(convertedValue);
    }
  };

  const handleCopyToClipboard = () => {
    if (convertedValue) {
      navigator.clipboard.writeText(convertedValue);
      toast({
        title: "Copied to clipboard!",
        description: `Value ${convertedValue} has been copied.`,
      });
    }
  };

  const handleAddToHistory = () => {
    if (convertedValue) {
      const expression = `${value} (base ${fromBase}) to base ${toBase}`;
      const result = convertedValue;
      addHistory({ expression, result });
      toast({
        title: "Saved to history",
        description: `${expression} = ${result}`,
      });
    }
  };

  const hasResult = convertedValue !== null && !error;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Replace className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Number Base Converter</CardTitle>
                <CardDescription>Convert numbers between different bases.</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>From</Label>
                <Select value={fromBase} onValueChange={setFromBase}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map(b => <SelectItem key={b.value} value={String(b.value)}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSwapBases} className="h-11 w-11">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <Label>To</Label>
                <Select value={toBase} onValueChange={setToBase}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map(b => <SelectItem key={b.value} value={String(b.value)}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-lg font-mono"
              />
               {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
          </div>
          
          {hasResult && (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border text-center">
                <Label className="text-sm text-muted-foreground">Result</Label>
                <p className="text-4xl font-bold tracking-tight text-primary font-mono">
                  {convertedValue}
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
