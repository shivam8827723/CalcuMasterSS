"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Flame, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive' | 'extraActive';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
  extraActive: 2.2, // Custom addition for more intense activity
};

const activityDescriptions: Record<ActivityLevel, string> = {
    sedentary: "Little or no exercise",
    light: "Light exercise/sports 1-3 days/week",
    moderate: "Moderate exercise/sports 3-5 days/week",
    active: "Hard exercise/sports 6-7 days a week",
    veryActive: "Very hard exercise/sports & physical job",
    extraActive: "Very hard exercise/sports & physical job (2x training)",
}

export function BmrCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('light');
  
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const bmr = useMemo(() => {
    const ageNum = parseInt(age);
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);

    if (unit === 'imperial') {
        weightKg = parseFloat(weight) * 0.453592;
        heightCm = parseFloat(height) * 2.54;
    }

    if (isNaN(ageNum) || isNaN(weightKg) || isNaN(heightCm) || ageNum <= 0 || weightKg <= 0 || heightCm <= 0) {
      return null;
    }

    if (gender === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }
  }, [age, weight, height, gender, unit]);

  const dailyCalories = useMemo(() => {
      if(!bmr) return null;
      return bmr * activityMultipliers[activityLevel];
  }, [bmr, activityLevel]);


  const handleAddToHistory = () => {
    if (bmr !== null) {
      const expression = `BMR for ${age}y old ${gender}`;
      addHistory({ expression, result: `${Math.round(bmr)} calories/day` });
      toast({
        title: "Saved to history",
        description: `BMR Result ${Math.round(bmr)} saved.`,
      });
    }
  };

  const hasResult = bmr !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>BMR &amp; Daily Calorie Calculator</CardTitle>
              <CardDescription>Calculate your Basal Metabolic Rate and daily calorie needs.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <RadioGroup value={unit} onValueChange={(v) => setUnit(v as UnitSystem)} className="grid grid-cols-2 gap-2 col-span-2">
                        <Label htmlFor="metric" className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-accent [&:has(:checked)]:border-primary">
                            <RadioGroupItem value="metric" id="metric" />
                            <span>Metric</span>
                        </Label>
                         <Label htmlFor="imperial" className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-accent [&:has(:checked)]:border-primary">
                            <RadioGroupItem value="imperial" id="imperial" />
                            <span>Imperial</span>
                        </Label>
                    </RadioGroup>
                    <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
                        <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor="height">Height ({unit === 'metric' ? 'cm' : 'in'})</Label>
                        <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} />
                    </div>
                </div>
            </div>
          
            {hasResult && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <div className="p-4 rounded-lg bg-muted border text-center space-y-1">
                        <Label className="text-sm text-muted-foreground">Your BMR</Label>
                        <p className="text-4xl font-bold tracking-tight text-primary">
                            {Math.round(bmr).toLocaleString()}
                        </p>
                         <p className="text-xs text-muted-foreground">calories/day</p>
                        <p className="text-sm pt-2">Your body needs this many calories to maintain basic functions while at rest.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Daily Calorie Needs</Label>
                        <Select value={activityLevel} onValueChange={(v: ActivityLevel) => setActivityLevel(v)}>
                           <SelectTrigger className="h-auto">
                             <div className="flex flex-col items-start p-1">
                                <SelectValue />
                                <span className="text-xs text-muted-foreground">
                                    {activityDescriptions[activityLevel]}
                                </span>
                             </div>
                           </SelectTrigger>
                           <SelectContent>
                            {Object.entries(activityDescriptions).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                           </SelectContent>
                        </Select>
                    </div>
                     <div className="p-4 rounded-lg bg-muted border text-center space-y-1">
                        <Label className="text-sm text-muted-foreground">Daily Calorie Needs to Maintain Weight</Label>
                        <p className="text-4xl font-bold tracking-tight text-primary">
                            {Math.round(dailyCalories || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">calories/day</p>
                    </div>
                </div>
            )}
        </CardContent>
        {hasResult && (
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={handleAddToHistory}>
              <History className="mr-2 h-4 w-4" /> Save BMR
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
