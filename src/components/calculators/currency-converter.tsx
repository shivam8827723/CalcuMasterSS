"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, History, ArrowRightLeft, Info, Replace } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const currencies = [
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'BRL', name: 'Brazilian Real' },
];

// Note: These are not live rates and are for demonstration purposes only.
// Rates are relative to USD.
const exchangeRates: { [key: string]: number } = {
  'USD': 1.0,
  'EUR': 0.92,
  'JPY': 157.25,
  'GBP': 0.79,
  'AUD': 1.50,
  'CAD': 1.37,
  'CHF': 0.89,
  'CNY': 7.25,
  'INR': 83.54,
  'BRL': 5.25,
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return null;

    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    
    if (!rateFrom || !rateTo) return null;

    const amountInUSD = numAmount / rateFrom;
    const result = amountInUSD * rateTo;
    
    return Number(result.toFixed(2));
  }, [amount, fromCurrency, toCurrency]);

  const exchangeRateInfo = useMemo(() => {
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    if (!rateFrom || !rateTo) return '';
    const rate = rateTo / rateFrom;
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  }, [fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopyToClipboard = () => {
    if (convertedAmount !== null) {
      navigator.clipboard.writeText(convertedAmount.toString());
      toast({
        title: "Copied to clipboard!",
        description: `Amount ${convertedAmount.toLocaleString()} has been copied.`,
      });
    }
  };

  const handleAddToHistory = () => {
    if (convertedAmount !== null) {
      const expression = `${amount} ${fromCurrency} to ${toCurrency}`;
      const result = `${convertedAmount.toLocaleString()} ${toCurrency}`;
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
                  <Replace className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Currency Converter</CardTitle>
                <CardDescription>Convert amounts between different currencies.</CardDescription>
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
                placeholder="e.g. 1000"
                className="text-lg"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="from">From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSwapCurrencies} className="h-11 w-11">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <Label htmlFor="to">To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Exchange rates are not live and are for demonstration purposes only.
            </AlertDescription>
          </Alert>

          {hasResult && (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border text-center">
                <Label className="text-sm text-muted-foreground">{amount} {fromCurrency} is equal to</Label>
                <p className="text-4xl font-bold tracking-tight text-primary">
                  {convertedAmount.toLocaleString()} <span className="text-2xl font-medium text-muted-foreground">{toCurrency}</span>
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
