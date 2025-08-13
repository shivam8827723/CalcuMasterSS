
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatorCategories } from '@/lib/calculator-config';
import { ArrowRight, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2" aria-label="Return to homepage">
            <Calculator className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">CalcuMaster SS</h1>
          </div>
          <Button asChild>
            <Link href="/calculators">Launch App</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 text-center bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Your All-in-One Online Calculator Suite
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              From complex scientific equations to everyday financial planning, CalcuMaster SS provides the tools you need with speed, accuracy, and a user-friendly interface.
            </p>
            <Button size="lg" asChild>
              <Link href="/calculators">
                Open CalcuMaster SS <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold">Explore Our Calculators</h3>
              <p className="text-muted-foreground mt-2">A comprehensive collection to solve any problem.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {calculatorCategories.map((category) => (
                <Card key={category.name} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-full">
                        <category.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-1">
                        {category.calculators.map(calc => (
                            <li key={calc.name}>
                                <Link href={calc.path} className="flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                    <calc.icon className="h-5 w-5 shrink-0" />
                                    <span className="text-sm font-medium">{calc.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} CalcuMaster SS. All rights reserved.</p>
           <p className="mt-2 text-xs">Owned &amp; Developed by <span className="font-semibold text-foreground">Shivam Sharma</span></p>
        </div>
      </footer>
    </div>
  );
}
