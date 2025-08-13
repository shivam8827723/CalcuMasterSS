
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bot, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { solveMathProblem, type MathSolverOutput } from '@/ai/flows/math-solver-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AiMathSolverPage() {
  const [problem, setProblem] = useState('');
  const [result, setResult] = useState<MathSolverOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!problem.trim()) {
      toast({
        title: "Please enter a problem",
        description: "The input field cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await solveMathProblem({ problem });
      setResult(response);
    } catch (error) {
      console.error("Error solving math problem:", error);
      toast({
        title: "An error occurred",
        description: "Could not solve the math problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="max-w-2xl w-full mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>AI Math Solver</CardTitle>
              <CardDescription>Get step-by-step solutions to complex math word problems.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="problem-input">Enter your math problem</Label>
            <Textarea
              id="problem-input"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., If a train travels at 60 mph for 3 hours, how far does it travel?"
              className="font-mono text-lg"
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Solve Problem
          </Button>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">The AI is thinking...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 pt-4">
              <Separator />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Solution</h3>
                <div className="prose prose-sm dark:prose-invert bg-muted p-4 rounded-lg border max-w-none">
                    <h4 className="font-semibold">Step-by-step Explanation:</h4>
                    <p style={{whiteSpace: 'pre-wrap'}}>{result.stepByStepSolution}</p>
                </div>
              </div>

               <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Final Answer</AlertTitle>
                <AlertDescription>
                  <p className="text-lg font-bold text-primary">{result.finalAnswer}</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">More AI calculators coming soon!</p>
        </CardFooter>
      </Card>
    </div>
  );
}
