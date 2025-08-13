"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/use-history';
import { Separator } from '@/components/ui/separator';

type Course = {
  id: number;
  name: string;
  grade: string;
  credits: string;
};

// Standard 4.0 scale
const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Course 1', grade: 'A', credits: '3' },
    { id: 2, name: 'Course 2', grade: 'B+', credits: '3' },
    { id: 3, name: 'Course 3', grade: 'A-', credits: '4' },
  ]);
  const { toast } = useToast();
  const { addHistory } = useHistory();

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const credits = parseFloat(course.credits);
        const gradePoint = gradePoints[course.grade.toUpperCase()];
        
        if (!isNaN(credits) && credits > 0 && gradePoint !== undefined) {
            totalPoints += gradePoint * credits;
            totalCredits += credits;
        }
    });

    if (totalCredits === 0) return null;

    return (totalPoints / totalCredits).toFixed(2);
  }, [courses]);

  const handleCourseChange = (id: number, field: keyof Course, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: `Course ${courses.length + 1}`, grade: 'A', credits: '3' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  
  const handleAddToHistory = () => {
    if (gpa) {
      addHistory({ expression: `GPA for ${courses.length} courses`, result: gpa });
      toast({
        title: "Saved to history",
        description: `GPA: ${gpa}`,
      });
    }
  };

  const hasResult = gpa !== null;

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-2xl w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>GPA Calculator</CardTitle>
              <CardDescription>Calculate your Grade Point Average (GPA).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr,100px,100px,min-content] gap-2 items-center font-medium px-2 text-sm text-muted-foreground">
              <span>Course Name (Optional)</span>
              <span className="text-center">Grade</span>
              <span className="text-center">Credits</span>
              <span />
            </div>
            {courses.map((course, index) => (
              <div key={course.id} className="grid grid-cols-[1fr,100px,100px,min-content] gap-2 items-center">
                <Input
                  type="text"
                  placeholder={`Course ${index + 1}`}
                  value={course.name}
                  onChange={e => handleCourseChange(course.id, 'name', e.target.value)}
                />
                 <Input
                  type="text"
                  placeholder="e.g. A, B+"
                  value={course.grade}
                  onChange={e => handleCourseChange(course.id, 'grade', e.target.value)}
                  className="text-center"
                />
                <Input
                  type="number"
                  placeholder="e.g. 3"
                  value={course.credits}
                  onChange={e => handleCourseChange(course.id, 'credits', e.target.value)}
                  className="text-center"
                />
                <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} disabled={courses.length <= 1}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addCourse}>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>

          {hasResult && (
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="p-4 rounded-lg bg-muted border text-center">
                <Label className="text-muted-foreground">Your GPA</Label>
                <p className="text-5xl font-bold tracking-tight text-primary">{gpa}</p>
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
