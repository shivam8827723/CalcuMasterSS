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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('10');
  const [tenure, setTenure] = useState('5');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      return { emi: null, totalInterest: null, totalAmount: null };
    }
    
    const monthlyRate = r / (12 * 100);
    const numberOfMonths = tenureUnit === 'years' ? t * 12 : t;
    
    if (monthlyRate === 0) {
        const calculatedEmi = p / numberOfMonths;
        return {
            emi: calculatedEmi,
            totalInterest: 0,
            totalAmount: p
        }
    }

    const emiCalc = p * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const calculatedTotalAmount = emiCalc * numberOfMonths;
    const calculatedTotalInterest = calculatedTotalAmount - p;
    
    return { 
      emi: Number(emiCalc.toFixed(2)),
      totalInterest: Number(calculatedTotalInterest.toFixed(2)),
      totalAmount: Number(calculatedTotalAmount.toFixed(2))
    };

  }, [principal, rate, tenure, tenureUnit]);

  const handleCopyToClipboard = () => {
    if (emi !== null) {
      const textToCopy = `EMI: ₹${emi.toLocaleString()}\nTotal Interest: ₹${totalInterest?.toLocaleString()}\nTotal Amount: ₹${totalAmount?.toLocaleString()}`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard!",
        description: `Loan details have been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if (emi !== null && totalAmount !== null) {
        const expression = `EMI for ₹${principal} at ${rate}% for ${tenure} ${tenureUnit}`;
        addHistory({ expression, result: `₹${emi.toLocaleString()}/month` });
        toast({
            title: "Saved to history",
            description: `${expression}`,
        });
    }
  };

  const hasResult = emi !== null && totalAmount !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Percent className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Loan/EMI Calculator</CardTitle>
                <CardDescription>Calculate your Equated Monthly Installment (EMI) for a loan.</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal">Loan Amount (₹)</Label>
              <Input 
                id="principal" 
                type="number" 
                value={principal} 
                onChange={(e) => setPrincipal(e.target.value)} 
                placeholder="e.g. 100000" 
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
                placeholder="e.g. 10"
                className="text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tenure">Loan Tenure</Label>
                <Input 
                  id="tenure" 
                  type="number" 
                  value={tenure} 
                  onChange={(e) => setTenure(e.target.value)} 
                  placeholder="e.g. 5"
                  className="text-lg"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={tenureUnit} onValueChange={(value: 'years' | 'months') => setTenureUnit(value)}>
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
               <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border space-y-2">
                  <Label className="text-sm text-muted-foreground">Monthly EMI</Label>
                  <p className="text-4xl font-bold tracking-tight text-primary">
                      ₹{emi.toLocaleString()}
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 border">
                  <Label className="text-sm text-muted-foreground">Total Interest</Label>
                  <p className="text-2xl font-semibold tracking-tight">
                    ₹{totalInterest?.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 border">
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <p className="text-2xl font-semibold tracking-tight">
                    ₹{totalAmount?.toLocaleString()}
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
