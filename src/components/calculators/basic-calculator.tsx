"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical } from 'lucide-react';

// Basic calculator engine that respects order of operations
const evaluateExpression = (expr: string): number | string => {
    try {
        // Replace visual operators with JS-friendly ones
        let sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');

        // This is a safer alternative to eval() for simple math
        const result = new Function('return ' + sanitizedExpr)();

        if (typeof result !== 'number' || !isFinite(result)) {
            return 'Error';
        }
        return result;
    } catch (error) {
        return 'Error';
    }
};


export function BasicCalculator() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        event.preventDefault(); // Prevent default browser actions

        if (/[0-9]/.test(key)) handleNumberClick(key);
        else if (key === '.') handleDecimalClick();
        else if (['+', '-', '*', '/'].includes(key)) handleOperatorClick(key === '*' ? '×' : key === '/' ? '÷' : key);
        else if (key === '(') handleParenthesisClick('(');
        else if (key === ')') handleParenthesisClick(')');
        else if (key === 'Enter' || key === '=') handleEqualClick();
        else if (key === 'Backspace') handleBackspace();
        else if (key === 'Escape' || key.toLowerCase() === 'c') handleClearClick();
        else if (key === '%') handlePercentClick();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expression, display, justEvaluated]);


  const clearState = (newDisplay = '0', newExpression = '') => {
      setDisplay(newDisplay);
      setExpression(newExpression);
      setJustEvaluated(false);
  };
  
  const handleNumberClick = (num: string) => {
      if (justEvaluated) {
          clearState(num, num);
          return;
      }
      setExpression(prev => (prev === '0' ? num : prev + num));
      setDisplay(prev => (prev === '0' ? num : prev + num));
  };
  
  const handleOperatorClick = (op: string) => {
      const lastChar = expression.slice(-1);
      if (['+', '-', '×', '÷'].includes(lastChar)) {
          // Replace last operator
          setExpression(prev => prev.slice(0, -1) + op);
          setDisplay(prev => prev.slice(0, -1) + op);
      } else {
          setExpression(prev => prev + op);
          setDisplay(prev => prev + op);
      }
      setJustEvaluated(false);
  };

  const handleParenthesisClick = (paren: '(' | ')') => {
      if (justEvaluated) {
          clearState(paren, paren);
          return;
      }
      setExpression(prev => prev + paren);
      setDisplay(prev => prev + paren);
  };
  
  const handleEqualClick = () => {
    if (!expression) return;
    const result = evaluateExpression(expression);
    if (result === 'Error') {
        toast({ title: "Invalid Expression", variant: "destructive" });
        return;
    }
    const resultString = String(Number(result.toPrecision(15)));
    setDisplay(resultString);
    setExpression(resultString);
    setJustEvaluated(true);
  };

  const handleBackspace = () => {
      if (justEvaluated) {
          clearState();
          return;
      }
      if (display.length > 1) {
          setDisplay(prev => prev.slice(0, -1));
          setExpression(prev => prev.slice(0, -1));
      } else {
          clearState();
      }
  };

  const handleClearClick = () => {
      clearState();
  };

  const handleDecimalClick = () => {
      // Basic implementation: needs logic to prevent multiple decimals in one number segment
      setExpression(prev => prev + '.');
      setDisplay(prev => prev + '.');
      setJustEvaluated(false);
  };
  
  const handleSignClick = () => {
      // More complex with expressions, need to find the last number
      // For now, let's keep it simple: applies to the whole display if it's just a number
      if (!isNaN(Number(display))) {
          const newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display;
          setDisplay(newDisplay);
          setExpression(newDisplay);
      }
  };

  const handlePercentClick = () => {
      try {
          const result = evaluateExpression(expression)
          if (typeof result === 'number') {
              const percentValue = result / 100;
              setDisplay(String(percentValue));
              setExpression(String(percentValue));
              setJustEvaluated(true);
          }
      } catch {
          toast({ title: "Invalid Expression for Percentage", variant: "destructive" });
      }
  };

  const handleScientificFunction = (func: string) => {
    let value = parseFloat(display);
    if (isNaN(value)) return;

    let result: number | undefined;
    let newExpression = '';
    
    try {
        switch(func) {
            case 'sin': result = Math.sin(value * Math.PI / 180); newExpression = `sin(${value})`; break;
            case 'cos': result = Math.cos(value * Math.PI / 180); newExpression = `cos(${value})`; break;
            case 'tan': result = Math.tan(value * Math.PI / 180); newExpression = `tan(${value})`; break;
            case 'ln': result = Math.log(value); newExpression = `ln(${value})`; break;
            case 'log': result = Math.log10(value); newExpression = `log10(${value})`; break;
            case '√': result = Math.sqrt(value); newExpression = `√(${value})`; break;
            case 'x²': result = Math.pow(value, 2); newExpression = `${value}²`; break;
            case 'x³': result = Math.pow(value, 3); newExpression = `${value}³`; break;
            case '!': 
                if (value < 0 || !Number.isInteger(value)) {
                    toast({ title: "Invalid input for factorial", variant: "destructive" }); return;
                }
                result = 1;
                for (let i = 2; i <= value; i++) result *= i;
                newExpression = `${value}!`;
                break;
            case 'π': result = Math.PI; newExpression = 'π'; break;
            case 'e': result = Math.E; newExpression = 'e'; break;
            default: return;
        }

        if(result === undefined || result === Infinity || isNaN(result)){
            toast({ title: "Calculation Error", variant: "destructive" });
            return;
        }
        
        const resultString = String(Number(result.toPrecision(15)));
        setDisplay(resultString);
        setExpression(resultString);
        setJustEvaluated(true);
    } catch {
       toast({ title: "Calculation Error", variant: "destructive" });
    }
  };


  const getDisplayFontSize = () => {
    const length = display.length;
    if (length > 18) return 'text-2xl';
    if (length > 12) return 'text-3xl';
    if (length > 9) return 'text-4xl';
    return 'text-5xl';
  }

  const renderButton = (label: string, onClick: () => void, className?: string, size: "default" | "lg" = "lg") => (
    <Button
      variant="outline"
      className={cn("text-xl font-semibold h-auto aspect-square p-0", className)}
      size={size}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  const renderScientificButton = (label: string, onClick: () => void, className?: string) => renderButton(label, onClick, cn("text-base bg-muted hover:bg-muted/80", className));

  return (
    <div className="flex justify-center items-start h-full">
        <Card className="max-w-sm w-full mx-auto shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <FlaskConical className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Scientific Calculator</CardTitle>
                    <CardDescription>Perform basic and advanced calculations.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4">
            <div className="mb-4 text-right h-20 flex flex-col justify-end">
                <div className="h-8 text-muted-foreground text-xl truncate" title={expression}>
                    {justEvaluated ? `${expression} =` : expression || ' '}
                </div>
                <Input 
                    readOnly 
                    value={display} 
                    className={cn(
                        "font-mono text-right h-12 pr-4 bg-transparent border-0 text-foreground p-0",
                        getDisplayFontSize()
                    )}
                    aria-label="Calculator display"
                />
            </div>
            <Tabs value={isScientific ? "scientific" : "basic"} onValueChange={(val) => setIsScientific(val === 'scientific')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="mt-4">
                <div className="grid grid-cols-4 gap-2">
                {renderButton('C', handleClearClick, "bg-muted hover:bg-muted/80")}
                {renderButton('+/-', handleSignClick, "bg-muted hover:bg-muted/80")}
                {renderButton('%', handlePercentClick, "bg-muted hover:bg-muted/80")}
                {renderButton('÷', () => handleOperatorClick('÷'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                
                {renderButton('7', () => handleNumberClick('7'))}
                {renderButton('8', () => handleNumberClick('8'))}
                {renderButton('9', () => handleNumberClick('9'))}
                {renderButton('×', () => handleOperatorClick('×'), "bg-accent text-accent-foreground hover:bg-accent/90")}

                {renderButton('4', () => handleNumberClick('4'))}
                {renderButton('5', () => handleNumberClick('5'))}
                {renderButton('6', () => handleNumberClick('6'))}
                {renderButton('-', () => handleOperatorClick('-'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                
                {renderButton('1', () => handleNumberClick('1'))}
                {renderButton('2', () => handleNumberClick('2'))}
                {renderButton('3', () => handleNumberClick('3'))}
                {renderButton('+', () => handleOperatorClick('+'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                
                {renderButton('0', () => handleNumberClick('0'), "col-span-2 w-full aspect-[2/1]")}
                {renderButton('.', handleDecimalClick)}
                {renderButton('=', handleEqualClick, "bg-primary text-primary-foreground hover:bg-primary/90")}
                </div>
            </TabsContent>
            <TabsContent value="scientific" className="mt-4">
                <div className="grid grid-cols-5 gap-2">
                    {renderScientificButton('sin', () => handleScientificFunction('sin'))}
                    {renderScientificButton('cos', () => handleScientificFunction('cos'))}
                    {renderScientificButton('tan', () => handleScientificFunction('tan'))}
                    {renderScientificButton('log', () => handleScientificFunction('log'))}
                    {renderScientificButton('ln', () => handleScientificFunction('ln'))}

                    {renderScientificButton('x²', () => handleScientificFunction('x²'))}
                    {renderScientificButton('x³', () => handleScientificFunction('x³'))}
                    {renderScientificButton('xʸ', () => handleOperatorClick('**'))}
                    {renderScientificButton('√', () => handleScientificFunction('√'))}
                    {renderScientificButton('n!', () => handleScientificFunction('!'))}
                    
                    {renderScientificButton('π', () => handleScientificFunction('π'))}
                    {renderScientificButton('e', () => handleScientificFunction('e'))}
                    {renderButton('(', () => handleParenthesisClick('('), "bg-muted hover:bg-muted/80 text-lg")}
                    {renderButton(')', () => handleParenthesisClick(')'), "bg-muted hover:bg-muted/80 text-lg")}
                    {renderButton('C', handleClearClick, "bg-destructive hover:bg-destructive/80 text-destructive-foreground")}
                    
                    {renderButton('7', () => handleNumberClick('7'))}
                    {renderButton('8', () => handleNumberClick('8'))}
                    {renderButton('9', () => handleNumberClick('9'))}
                    {renderButton('÷', () => handleOperatorClick('÷'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                    {renderButton('×', () => handleOperatorClick('×'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                    
                    {renderButton('4', () => handleNumberClick('4'))}
                    {renderButton('5', () => handleNumberClick('5'))}
                    {renderButton('6', () => handleNumberClick('6'))}
                    {renderButton('-', () => handleOperatorClick('-'), "bg-accent text-accent-foreground hover:bg-accent/90")}
                    <div className="row-span-2">
                        {renderButton('+', () => handleOperatorClick('+'), "bg-accent text-accent-foreground hover:bg-accent/90 w-full aspect-[1/2.1]")}
                    </div>

                    {renderButton('1', () => handleNumberClick('1'))}
                    {renderButton('2', () => handleNumberClick('2'))}
                    {renderButton('3', () => handleNumberClick('3'))}
                    

                    {renderButton('0', () => handleNumberClick('0'), "col-span-2 w-full aspect-[2/1]")}
                    {renderButton('.', handleDecimalClick)}
                    {renderButton('=', handleEqualClick, "bg-primary text-primary-foreground hover:bg-primary/90")}

                </div>
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    </div>
  );
}
