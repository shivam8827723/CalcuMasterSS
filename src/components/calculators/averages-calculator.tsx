"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, LineChart, Sigma } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AveragesCalculator() {
  const [input, setInput] = useState('10, 20, 20, 30, 40');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { numbers, mean, median, mode, sum, count } = useMemo(() => {
    const parsedNumbers = input
        .split(/[\s,]+/)
        .filter(n => n.trim() !== '')
        .map(Number)
        .filter(n => !isNaN(n));
    
    if (parsedNumbers.length === 0) {
        return { numbers: [], mean: null, median: null, mode: null, sum: 0, count: 0 };
    }

    const count = parsedNumbers.length;
    const sum = parsedNumbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    const sorted = [...parsedNumbers].sort((a, b) => a - b);
    let median;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
        median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        median = sorted[mid];
    }
    
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    for (const num of parsedNumbers) {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    }
    
    let mode: number[] = [];
    if (maxFreq > 1) {
        mode = Object.keys(frequency)
            .map(Number)
            .filter(key => frequency[key] === maxFreq);
    }

    return {
      numbers: parsedNumbers,
      mean: Number(mean.toPrecision(15)),
      median: Number(median.toPrecision(15)),
      mode: mode,
      sum: Number(sum.toPrecision(15)),
      count,
    };
  }, [input]);

  const handleAddToHistory = () => {
    if (mean !== null) {
      const expression = `Avg of ${numbers.slice(0, 3).join(', ')}...`;
      const result = `Mean: ${mean.toLocaleString()}`;
      addHistory({ expression, result });
      toast({
        title: "Saved to history",
        description: `Calculation saved: ${expression}`,
      });
    }
  };

  const hasResult = numbers.length > 0;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <LineChart className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Averages Calculator</CardTitle>
              <CardDescription>Calculate mean, median, and mode from a list of numbers.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="numbers-input">Enter numbers (comma or space separated)</Label>
            <Textarea
              id="numbers-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 10, 20, 20, 30, 40"
              className="font-mono text-lg"
              rows={3}
            />
          </div>

          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mean (Average)</TableCell>
                    <TableCell className="text-right font-mono text-lg text-primary">{mean?.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Median</TableCell>
                    <TableCell className="text-right font-mono text-lg">{median?.toLocaleString()}</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell className="font-medium">Mode</TableCell>
                    <TableCell className="text-right font-mono text-lg">
                      {mode && mode.length > 0 ? mode.join(', ') : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sum</TableCell>
                    <TableCell className="text-right font-mono text-lg">{sum.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Count</TableCell>
                    <TableCell className="text-right font-mono text-lg">{count}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
