"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, History, Receipt, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type TaxCalculation = 'add' | 'extract';

export function SalesTaxCalculator() {
  const [amount, setAmount] = useState('100');
  const [taxRate, setTaxRate] = useState('8');
  const [taxType, setTaxType] = useState<TaxCalculation>('add');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { taxAmount, finalAmount, originalAmount } = useMemo(() => {
    const price = parseFloat(amount);
    const rate = parseFloat(taxRate);

    if (isNaN(price) || isNaN(rate) || price < 0 || rate < 0) {
      return { taxAmount: null, finalAmount: null, originalAmount: null };
    }
    
    if (taxType === 'add') {
      const tax = price * (rate / 100);
      const total = price + tax;
      return { 
        taxAmount: Number(tax.toFixed(2)),
        finalAmount: Number(total.toFixed(2)),
        originalAmount: Number(price.toFixed(2)),
      };
    } else { // extract tax
      const original = price / (1 + (rate / 100));
      const tax = price - original;
      return {
        taxAmount: Number(tax.toFixed(2)),
        finalAmount: Number(price.toFixed(2)),
        originalAmount: Number(original.toFixed(2)),
      };
    }
  }, [amount, taxRate, taxType]);

  const handleCopyToClipboard = () => {
    if (finalAmount !== null) {
      const textToCopy = `Final Price: ₹${finalAmount.toLocaleString()}\nTax Amount: ₹${taxAmount?.toLocaleString()}`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard!",
        description: `Tax details have been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if (finalAmount !== null) {
        const expression = `${taxRate}% tax on ₹${amount}`;
        addHistory({ expression, result: `Final Price: ₹${finalAmount.toLocaleString()}` });
        toast({
            title: "Saved to history",
            description: `${expression}`,
        });
    }
  };

  const hasResult = finalAmount !== null;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-md w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Receipt className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Sales Tax Calculator</CardTitle>
                    <CardDescription>Calculate sales tax and total price.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <RadioGroup value={taxType} onValueChange={(v) => setTaxType(v as TaxCalculation)} className="grid grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="add" id="add" className="peer sr-only" />
                    <Label htmlFor="add" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Add Tax
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="extract" id="extract" className="peer sr-only" />
                    <Label htmlFor="extract" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Extract Tax
                    </Label>
                </div>
            </RadioGroup>
            <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="amount">{taxType === 'add' ? 'Pre-Tax Price (₹)' : 'Post-Tax Price (₹)'}</Label>
                    <Input 
                        id="amount" 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        placeholder="e.g. 100"
                        className="text-lg"
                    />
                </div>
                 <div>
                    <Label htmlFor="taxRate">Tax Rate</Label>
                    <div className="relative">
                        <Input 
                            id="taxRate" 
                            type="number" 
                            value={taxRate} 
                            onChange={(e) => setTaxRate(e.target.value)} 
                            placeholder="e.g. 8" 
                            className="pl-8 text-lg"
                        />
                        <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {hasResult && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                            <Label className="text-sm text-muted-foreground">Original Price</Label>
                            <p className="text-3xl font-bold tracking-tight">
                                ₹{originalAmount?.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                            <Label className="text-sm text-muted-foreground">Tax Amount</Label>
                            <p className="text-3xl font-bold tracking-tight">
                                ₹{taxAmount?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10 border-primary border">
                        <Label className="text-sm text-primary/80">Final Price</Label>
                        <p className="text-4xl font-bold tracking-tight text-primary">
                            ₹{finalAmount?.toLocaleString()}
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
                    <Copy className="mr-2 h-4 w-4" /> Copy Results
                </Button>
            </CardFooter>
        )}
        </Card>
    </div>
  );
}
