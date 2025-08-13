"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, Sigma, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function ProbabilityCalculator() {
  const [favorable, setFavorable] = useState('1');
  const [total, setTotal] = useState('6');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { probability, percentage, oddsFor, oddsAgainst } = useMemo(() => {
    const fav = parseInt(favorable);
    const tot = parseInt(total);

    if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) {
      return { probability: null, percentage: null, oddsFor: null, oddsAgainst: null };
    }

    const prob = fav / tot;

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    
    const commonDivisorFor = gcd(fav, tot - fav);
    const oddsForStr = `${fav / commonDivisorFor} : ${(tot - fav) / commonDivisorFor}`;

    const commonDivisorAgainst = gcd(tot - fav, fav);
    const oddsAgainstStr = `${(tot - fav) / commonDivisorAgainst} : ${fav / commonDivisorAgainst}`;
    
    return {
      probability: prob,
      percentage: prob * 100,
      oddsFor: oddsForStr,
      oddsAgainst: oddsAgainstStr,
    };
  }, [favorable, total]);

  const handleAddToHistory = () => {
    if (probability !== null) {
      const expression = `P(${favorable}/${total})`;
      addHistory({ expression, result: `${probability.toFixed(4)}` });
      toast({
        title: "Saved to history",
        description: `Probability calculation saved.`,
      });
    }
  };

  const hasResult = probability !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Sigma className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Probability Calculator</CardTitle>
              <CardDescription>Calculate the probability of an event.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="favorable">Number of Favorable Outcomes</Label>
              <Input id="favorable" type="number" value={favorable} onChange={e => setFavorable(e.target.value)} className="text-lg" />
            </div>
            <div>
              <Label htmlFor="total">Total Number of Outcomes</Label>
              <Input id="total" type="number" value={total} onChange={e => setTotal(e.target.value)} className="text-lg" />
            </div>
          </div>

          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="p-4 rounded-lg bg-muted border text-center">
                <Label className="text-muted-foreground">Probability</Label>
                <p className="text-4xl font-bold tracking-tight text-primary">
                  {probability.toFixed(4)}
                </p>
                <p className="text-muted-foreground">
                  = {favorable}/{total} = {percentage?.toFixed(2)}%
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-3 rounded-lg bg-muted/50 border text-center">
                    <Label className="text-muted-foreground text-sm">Odds in Favor</Label>
                    <p className="font-mono text-xl">{oddsFor}</p>
                 </div>
                 <div className="p-3 rounded-lg bg-muted/50 border text-center">
                    <Label className="text-muted-foreground text-sm">Odds Against</Label>
                    <p className="font-mono text-xl">{oddsAgainst}</p>
                 </div>
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
