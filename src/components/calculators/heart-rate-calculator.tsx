"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const zones = [
  { name: 'Warm-up / Recovery', intensity: [50, 60], color: 'bg-blue-500' },
  { name: 'Fat Burning', intensity: [60, 70], color: 'bg-green-500' },
  { name: 'Aerobic / Endurance', intensity: [70, 80], color: 'bg-yellow-500' },
  { name: 'Anaerobic / Performance', intensity: [80, 90], color: 'bg-orange-500' },
  { name: 'Max Effort', intensity: [90, 100], color: 'bg-red-500' },
];

export function HeartRateCalculator() {
  const [age, setAge] = useState('25');

  const { maxHeartRate, heartRateZones } = useMemo(() => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      return { maxHeartRate: null, heartRateZones: [] };
    }
    
    const mhr = 220 - ageNum;
    
    const calculatedZones = zones.map(zone => {
      const lower = Math.round(mhr * (zone.intensity[0] / 100));
      const upper = Math.round(mhr * (zone.intensity[1] / 100));
      return { ...zone, range: `${lower} - ${upper} bpm` };
    });

    return {
      maxHeartRate: mhr,
      heartRateZones: calculatedZones,
    };
  }, [age]);
  
  const hasResult = maxHeartRate !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Heart Rate Zone Calculator</CardTitle>
              <CardDescription>Find your target heart rate zones for exercise.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Your Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="e.g., 25"
              className="text-lg"
            />
          </div>

          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="p-4 rounded-lg bg-muted border text-center">
                <Label className="text-muted-foreground">Estimated Max Heart Rate</Label>
                <p className="text-4xl font-bold tracking-tight text-primary">
                  {maxHeartRate} <span className="text-lg font-medium">bpm</span>
                </p>
              </div>

              <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Zone</TableHead>
                            <TableHead>Intensity</TableHead>
                            <TableHead className="text-right">Heart Rate Range</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {heartRateZones.map(zone => (
                        <TableRow key={zone.name}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${zone.color}`}></div>
                                {zone.name}
                            </TableCell>
                            <TableCell>{zone.intensity[0]}-{zone.intensity[1]}%</TableCell>
                            <TableCell className="text-right font-mono">{zone.range}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
