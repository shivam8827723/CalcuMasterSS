"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, Shuffle, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const [minInt, maxInt] = useMemo(() => {
    return [parseInt(min), parseInt(max)];
  }, [min, max]);

  const generateRandomNumber = () => {
    if (isNaN(minInt) || isNaN(maxInt) || minInt > maxInt) {
      toast({
        title: "Invalid Range",
        description: "Please ensure 'Min' is less than or equal to 'Max'.",
        variant: "destructive",
      });
      setResult(null);
      return;
    }
    // This logic is safe to run on the client after user interaction.
    const randomNumber = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    setResult(randomNumber);
  };
  
  const handleAddToHistory = () => {
    if (result !== null) {
      addHistory({ expression: `Random (${min}-${max})`, result: String(result) });
      toast({
        title: "Saved to history",
        description: `Random number ${result} saved.`,
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (result !== null) {
      navigator.clipboard.writeText(String(result));
      toast({
        title: "Copied to clipboard!",
        description: `Value ${result} has been copied.`,
      });
    }
  };

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Shuffle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Random Number Generator</CardTitle>
              <CardDescription>Generate a random number within a specified range.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min">Min</Label>
              <Input id="min" type="number" value={min} onChange={e => setMin(e.target.value)} className="text-lg" />
            </div>
            <div>
              <Label htmlFor="max">Max</Label>
              <Input id="max" type="number" value={max} onChange={e => setMax(e.target.value)} className="text-lg" />
            </div>
          </div>
          
          <Button size="lg" className="w-full" onClick={generateRandomNumber}>
            <Shuffle className="mr-2 h-5 w-5" /> Generate
          </Button>

          {result !== null && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="p-6 rounded-lg bg-muted border text-center">
                <Label className="text-muted-foreground">Result</Label>
                <p className="text-6xl font-bold tracking-tight text-primary">{result}</p>
              </div>
            </div>
          )}
        </CardContent>
        {result !== null && (
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
