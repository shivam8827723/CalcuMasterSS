"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, Sparkles, Percent, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function TipCalculator() {
  const [bill, setBill] = useState('100');
  const [tipPercentage, setTipPercentage] = useState('15');
  const [people, setPeople] = useState('1');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { tipAmount, totalAmount, tipPerPerson, totalPerPerson } = useMemo(() => {
    const billAmount = parseFloat(bill);
    const tipPercent = parseFloat(tipPercentage);
    const numPeople = parseInt(people);

    if (isNaN(billAmount) || isNaN(tipPercent) || isNaN(numPeople) || billAmount < 0 || tipPercent < 0 || numPeople < 1) {
      return { tipAmount: null, totalAmount: null, tipPerPerson: null, totalPerPerson: null };
    }

    const tip = billAmount * (tipPercent / 100);
    const total = billAmount + tip;
    const tipPP = tip / numPeople;
    const totalPP = total / numPeople;

    return {
      tipAmount: Number(tip.toFixed(2)),
      totalAmount: Number(total.toFixed(2)),
      tipPerPerson: Number(tipPP.toFixed(2)),
      totalPerPerson: Number(totalPP.toFixed(2)),
    };
  }, [bill, tipPercentage, people]);

  const handleAddToHistory = () => {
    if (totalAmount !== null) {
      addHistory({ expression: `${tipPercentage}% tip on ₹${bill}`, result: `Total: ₹${totalAmount}` });
      toast({ title: "Saved to history", description: `Tip calculation saved.` });
    }
  };

  const hasResult = totalAmount !== null;
  const tipPresets = [10, 15, 18, 20, 25];

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Tip Calculator</CardTitle>
              <CardDescription>Calculate tips and split the bill with ease.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="bill">Bill Amount (₹)</Label>
              <Input id="bill" type="number" value={bill} onChange={e => setBill(e.target.value)} className="text-lg" />
            </div>
            <div>
              <Label htmlFor="tipPercentage">Tip Percentage</Label>
               <div className="relative">
                <Input id="tipPercentage" type="number" value={tipPercentage} onChange={e => setTipPercentage(e.target.value)} className="pr-8 text-lg" />
                <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {tipPresets.map(p => (
                  <Button key={p} variant={tipPercentage === String(p) ? 'default' : 'outline'} onClick={() => setTipPercentage(String(p))}>
                    {p}%
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="people">Number of People</Label>
              <div className="relative">
                <Input id="people" type="number" value={people} onChange={e => setPeople(e.target.value)} className="pl-8 text-lg" min="1" step="1" />
                <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="p-4 rounded-lg bg-muted border">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <Label className="text-muted-foreground text-sm">Tip Amount</Label>
                        <p className="text-2xl font-semibold">₹{tipAmount?.toLocaleString()}</p>
                    </div>
                     <div className="text-center">
                        <Label className="text-muted-foreground text-sm">Total Bill</Label>
                        <p className="text-2xl font-semibold">₹{totalAmount?.toLocaleString()}</p>
                    </div>
                </div>
                 {parseInt(people) > 1 && (
                    <>
                    <Separator className="my-4" />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <Label className="text-muted-foreground text-sm">Tip per Person</Label>
                            <p className="text-2xl font-semibold">₹{tipPerPerson?.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <Label className="text-muted-foreground text-sm">Total per Person</Label>
                            <p className="text-2xl font-semibold">₹{totalPerPerson?.toLocaleString()}</p>
                        </div>
                    </div>
                    </>
                 )}
              </div>
            </div>
          )}

        </CardContent>
        {hasResult && (
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={handleAddToHistory}>
              <History className="mr-2 h-4 w-4" /> Save
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
