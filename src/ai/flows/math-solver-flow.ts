'use server';
/**
 * @fileOverview An AI flow for solving mathematical word problems.
 *
 * - solveMathProblem - A function that handles the math problem-solving process.
 * - MathSolverInput - The input type for the solveMathProblem function.
 * - MathSolverOutput - The return type for the solveMathProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MathSolverInputSchema = z.object({
  problem: z.string().describe('The math word problem to be solved.'),
});
export type MathSolverInput = z.infer<typeof MathSolverInputSchema>;

const MathSolverOutputSchema = z.object({
  stepByStepSolution: z.string().describe('A detailed, step-by-step explanation of how to solve the problem.'),
  finalAnswer: z.string().describe('The final answer to the math problem.'),
});
export type MathSolverOutput = z.infer<typeof MathSolverOutputSchema>;

export async function solveMathProblem(input: MathSolverInput): Promise<MathSolverOutput> {
  return mathSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mathSolverPrompt',
  input: { schema: MathSolverInputSchema },
  output: { schema: MathSolverOutputSchema },
  prompt: `You are an expert math tutor. Your task is to solve the following math word problem.
  
Provide a clear, step-by-step solution that is easy to follow. Explain each step logically.
Finally, state the final answer clearly.

Math Problem:
{{{problem}}}
`,
});

const mathSolverFlow = ai.defineFlow(
  {
    name: 'mathSolverFlow',
    inputSchema: MathSolverInputSchema,
    outputSchema: MathSolverOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
