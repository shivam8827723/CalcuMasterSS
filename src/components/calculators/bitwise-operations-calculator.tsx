"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, History, Binary } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Operation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT';
const unaryOps: Operation[] = ['NOT', 'LSHIFT', 'RSHIFT'];

export function BitwiseOperationsCalculator() {
  const [num1, setNum1] = useState('10'); // Decimal string
  const [num2, setNum2] = useState('5');  // Decimal string
  const [shiftAmount, setShiftAmount] = useState('2');
  const [operation, setOperation] = useState<Operation>('AND');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const isUnary = useMemo(() => unaryOps.includes(operation), [operation]);

  const result = useMemo(() => {
    const n1 = parseInt(num1, 10);
    const n2 = parseInt(num2, 10);
    const shift = parseInt(shiftAmount, 10);

    if (isNaN(n1) || (!isUnary && isNaN(n2)) || (isUnary && (operation === 'LSHIFT' || operation === 'RSHIFT') && isNaN(shift))) {
      return null;
    }

    let resDec: number;
    switch (operation) {
      case 'AND': resDec = n1 & n2; break;
      case 'OR': resDec = n1 | n2; break;
      case 'XOR': resDec = n1 ^ n2; break;
      case 'NOT': resDec = ~n1; break;
      case 'LSHIFT': resDec = n1 << shift; break;
      case 'RSHIFT': resDec = n1 >> shift; break;
      default: return null;
    }
    
    return {
      dec: resDec.toString(10),
      bin: (resDec >>> 0).toString(2).padStart(8, '0'),
      hex: '0x' + resDec.toString(16).toUpperCase(),
    };
  }, [num1, num2, operation, shiftAmount, isUnary]);

  const expression = useMemo(() => {
    switch (operation) {
      case 'AND': return `${num1} & ${num2}`;
      case 'OR': return `${num1} | ${num2}`;
      case 'XOR': return `${num1} ^ ${num2}`;
      case 'NOT': return `~${num1}`;
      case 'LSHIFT': return `${num1} << ${shiftAmount}`;
      case 'RSHIFT': return `${num1} >> ${shiftAmount}`;
    }
  }, [num1, num2, operation, shiftAmount]);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard!",
      description: `Value ${value} has been copied.`,
    });
  };

  const handleAddToHistory = () => {
    if (result) {
      addHistory({ expression, result: result.dec });
      toast({
        title: "Saved to history",
        description: `${expression} = ${result.dec}`,
      });
    }
  };

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Binary className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Bitwise Operations</CardTitle>
                  <CardDescription>Perform bitwise operations on integers.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="num1">Number {isUnary ? '' : '1'}</Label>
              <Input id="num1" type="number" value={num1} onChange={e => setNum1(e.target.value)} className="text-lg font-mono" />
            </div>
            {!isUnary && (
              <div>
                <Label htmlFor="num2">Number 2</Label>
                <Input id="num2" type="number" value={num2} onChange={e => setNum2(e.target.value)} className="text-lg font-mono" />
              </div>
            )}
            <div>
                <Label>Operation</Label>
                <Select value={operation} onValueChange={(v: Operation) => setOperation(v)}>
                    <SelectTrigger className="text-lg h-11">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="AND">AND (&)</SelectItem>
                    <SelectItem value="OR">OR (|)</SelectItem>
                    <SelectItem value="XOR">XOR (^)</SelectItem>
                    <SelectItem value="NOT">NOT (~)</SelectItem>
                    <SelectItem value="LSHIFT">Left Shift (<<)</SelectItem>
                    <SelectItem value="RSHIFT">Right Shift (>>)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             {(operation === 'LSHIFT' || operation === 'RSHIFT') && (
              <div>
                <Label htmlFor="shiftAmount">Shift Amount</Label>
                <Input id="shiftAmount" type="number" value={shiftAmount} onChange={e => setShiftAmount(e.target.value)} className="text-lg font-mono" />
              </div>
            )}
          </div>
          
          {result && (
            <div className="space-y-4">
              <Separator />
              <div className="text-center">
                 <Label className="text-muted-foreground">{expression} =</Label>
              </div>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Base</TableHead>
                    <TableHead className="text-right">Result</TableHead>
                     <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Decimal</TableCell>
                    <TableCell className="text-right font-mono text-lg">{result.dec}</TableCell>
                    <TableCell className="p-1"><Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(result.dec)}><Copy className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Binary</TableCell>
                    <TableCell className="text-right font-mono text-lg break-all">{result.bin}</TableCell>
                    <TableCell className="p-1"><Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(result.bin)}><Copy className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Hexadecimal</TableCell>
                    <TableCell className="text-right font-mono text-lg">{result.hex}</TableCell>
                    <TableCell className="p-1"><Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(result.hex)}><Copy className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {result && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleAddToHistory}>
              <History className="mr-2 h-4 w-4" /> Save
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
