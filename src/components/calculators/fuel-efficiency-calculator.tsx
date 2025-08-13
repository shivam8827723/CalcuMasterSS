"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, Fuel } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

export function FuelEfficiencyCalculator() {
  const [distance, setDistance] = useState('400');
  const [fuel, setFuel] = useState('30');
  const [price, setPrice] = useState('100');
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { efficiency, costPerKm } = useMemo(() => {
    const d = parseFloat(distance);
    const f = parseFloat(fuel);
    const p = parseFloat(price);

    if (isNaN(d) || isNaN(f) || d <= 0 || f <= 0) {
      return { efficiency: null, costPerKm: null };
    }
    
    const eff = d / f;
    let cpk = null;
    if (!isNaN(p) && p > 0) {
        cpk = (p * f) / d;
    }
    
    return { 
      efficiency: Number(eff.toFixed(2)),
      costPerKm: cpk ? Number(cpk.toFixed(2)) : null
    };
  }, [distance, fuel, price]);

  const handleAddToHistory = () => {
    if (efficiency !== null) {
        const expression = `Fuel efficiency for ${distance}km, ${fuel}L`;
        addHistory({ expression, result: `${efficiency} km/L` });
        toast({
            title: "Saved to history",
            description: `Calculation for ${efficiency} km/L saved.`,
        });
    }
  };

  const hasResult = efficiency !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Fuel className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Fuel Efficiency Calculator</CardTitle>
              <CardDescription>Calculate your vehicle's fuel efficiency and trip cost.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance">Distance (km)</Label>
              <Input id="distance" type="number" value={distance} onChange={e => setDistance(e.target.value)} className="text-lg" />
            </div>
            <div>
              <Label htmlFor="fuel">Fuel Used (liters)</Label>
              <Input id="fuel" type="number" value={fuel} onChange={e => setFuel(e.target.value)} className="text-lg" />
            </div>
             <div className="col-span-full">
              <Label htmlFor="price">Fuel Price (₹ per liter, optional)</Label>
              <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="text-lg" />
            </div>
          </div>

          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted border text-center">
                  <Label className="text-muted-foreground">Fuel Efficiency</Label>
                  <p className="text-3xl font-bold tracking-tight text-primary">{efficiency.toLocaleString()} <span className="text-lg">km/L</span></p>
                </div>
                <div className="p-4 rounded-lg bg-muted border text-center">
                  <Label className="text-muted-foreground">Cost per Km</Label>
                  <p className="text-3xl font-bold tracking-tight text-primary">
                    {costPerKm ? `₹${costPerKm.toLocaleString()}` : 'N/A'}
                  </p>
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
