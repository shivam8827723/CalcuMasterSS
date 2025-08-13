"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PersonStanding, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

type UnitSystem = 'metric' | 'imperial';

const BMICategory = {
    Underweight: { range: [0, 18.5], color: "bg-blue-500" },
    Normal: { range: [18.5, 24.9], color: "bg-green-500" },
    Overweight: { range: [25, 29.9], color: "bg-yellow-500" },
    Obese: { range: [30, Infinity], color: "bg-red-500" },
};

export function BmiCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState(unit === 'metric' ? '70' : '155');
  const [heightCm, setHeightCm] = useState('175');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');

  const { toast } = useToast();
  const { addHistory } = useHistory();

  const { bmi, category } = useMemo(() => {
    const w = parseFloat(weight);
    
    let hInMeters;
    if (unit === 'metric') {
        const hCm = parseFloat(heightCm);
        if (isNaN(hCm) || hCm <= 0) return { bmi: null, category: null };
        hInMeters = hCm / 100;
    } else {
        const hFt = parseFloat(heightFt);
        const hIn = parseFloat(heightIn);
        if (isNaN(hFt) || isNaN(hIn) || (hFt <= 0 && hIn <= 0)) return { bmi: null, category: null };
        hInMeters = (hFt * 12 + hIn) * 0.0254;
    }
    
    if (isNaN(w) || w <= 0 || hInMeters <= 0) {
      return { bmi: null, category: null };
    }

    const bmiValue = w / (hInMeters * hInMeters);

    let bmiCategory = null;
    for (const cat in BMICategory) {
        const { range } = BMICategory[cat as keyof typeof BMICategory];
        if (bmiValue >= range[0] && bmiValue < range[1]) {
            bmiCategory = cat;
            break;
        }
    }
    
    return { 
        bmi: Number(bmiValue.toFixed(1)),
        category: bmiCategory
    };

  }, [unit, weight, heightCm, heightFt, heightIn]);

  const handleUnitChange = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    // Rough conversion on unit change for better UX
    if (newUnit === 'imperial') {
        const hCm = parseFloat(heightCm);
        if(!isNaN(hCm)) {
            const totalInches = hCm / 2.54;
            setHeightFt(String(Math.floor(totalInches / 12)));
            setHeightIn(String(Math.round(totalInches % 12)));
        }
        const wKg = parseFloat(weight);
        if(!isNaN(wKg)) setWeight(String(Math.round(wKg * 2.20462)));
    } else {
        const hFt = parseFloat(heightFt);
        const hIn = parseFloat(heightIn);
        if(!isNaN(hFt) && !isNaN(hIn)) {
            const totalInches = (hFt * 12) + hIn;
            setHeightCm(String(Math.round(totalInches * 2.54)));
        }
        const wLbs = parseFloat(weight);
        if(!isNaN(wLbs)) setWeight(String(Math.round(wLbs / 2.20462)));
    }
  }

  const handleAddToHistory = () => {
    if (bmi !== null) {
        const expression = `BMI: W ${weight}${unit === 'metric' ? 'kg' : 'lbs'}, H ${unit === 'metric' ? `${heightCm}cm` : `${heightFt}'${heightIn}"`}`;
        addHistory({ expression, result: `${bmi} (${category})` });
        toast({
            title: "Saved to history",
            description: `BMI Result ${bmi} saved.`,
        });
    }
  };

  const hasResult = bmi !== null;
  const categoryInfo = category ? BMICategory[category as keyof typeof BMICategory] : null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <PersonStanding className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>BMI Calculator</CardTitle>
              <CardDescription>Calculate your Body Mass Index (BMI).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <RadioGroup value={unit} onValueChange={(v) => handleUnitChange(v as UnitSystem)} className="grid grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="metric" id="metric" className="peer sr-only" />
                    <Label htmlFor="metric" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Metric Units (kg, cm)
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="imperial" id="imperial" className="peer sr-only" />
                    <Label htmlFor="imperial" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Imperial Units (lbs, ft, in)
                    </Label>
                </div>
            </RadioGroup>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="text-lg"/>
                </div>
                {unit === 'metric' ? (
                    <div>
                        <Label htmlFor="heightCm">Height (cm)</Label>
                        <Input id="heightCm" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="text-lg"/>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="heightFt">Height (ft)</Label>
                            <Input id="heightFt" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="text-lg"/>
                        </div>
                        <div>
                            <Label htmlFor="heightIn">Height (in)</Label>
                            <Input id="heightIn" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="text-lg"/>
                        </div>
                    </div>
                )}
            </div>
          
            {hasResult && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border text-center space-y-2">
                        <Label className="text-sm text-muted-foreground">Your BMI</Label>
                        <p className="text-5xl font-bold tracking-tight text-primary">{bmi}</p>
                        {category && <p className="text-xl font-medium">{category}</p>}
                    </div>
                     <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${((bmi - 10) / 30) * 100}%`, backgroundColor: categoryInfo?.color.replace('bg-','').replace('-500', '') }}></div>
                    </div>
                    <div className="grid grid-cols-4 text-xs text-center">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
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
