"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, History, Tag, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('100');
  const [discount, setDiscount] = useState('25');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { finalPrice, amountSaved } = useMemo(() => {
    const price = parseFloat(originalPrice);
    const disc = parseFloat(discount);

    if (isNaN(price) || isNaN(disc) || price < 0 || disc < 0) {
      return { finalPrice: null, amountSaved: null };
    }
    
    const saved = (disc / 100) * price;
    const final = price - saved;
    
    return { 
      finalPrice: Number(final.toFixed(2)),
      amountSaved: Number(saved.toFixed(2))
    };

  }, [originalPrice, discount]);

  const handleCopyToClipboard = () => {
    if (finalPrice !== null) {
      const textToCopy = `Final Price: ₹${finalPrice.toLocaleString()}\nYou Save: ₹${amountSaved?.toLocaleString()}`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard!",
        description: `Discount details have been copied.`,
      });
    }
  };
  
  const handleAddToHistory = () => {
    if (finalPrice !== null) {
        const expression = `${discount}% off ₹${originalPrice}`;
        addHistory({ expression, result: `Final Price: ₹${finalPrice.toLocaleString()}` });
        toast({
            title: "Saved to history",
            description: `${expression}`,
        });
    }
  };

  const hasResult = finalPrice !== null;

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-md w-full mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Tag className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Discount Calculator</CardTitle>
                    <CardDescription>Calculate the final price after a discount.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input 
                        id="originalPrice" 
                        type="number" 
                        value={originalPrice} 
                        onChange={(e) => setOriginalPrice(e.target.value)} 
                        placeholder="e.g. 100"
                        className="text-lg"
                    />
                </div>
                 <div>
                    <Label htmlFor="discount">Discount</Label>
                    <div className="relative">
                        <Input 
                            id="discount" 
                            type="number" 
                            value={discount} 
                            onChange={(e) => setDiscount(e.target.value)} 
                            placeholder="e.g. 25" 
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
                            <Label className="text-sm text-muted-foreground">You Save</Label>
                            <p className="text-3xl font-bold tracking-tight text-destructive">
                                ₹{amountSaved?.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                            <Label className="text-sm text-muted-foreground">Final Price</Label>
                            <p className="text-3xl font-bold tracking-tight text-primary">
                                ₹{finalPrice?.toLocaleString()}
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
