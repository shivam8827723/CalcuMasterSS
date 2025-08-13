
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function CatchAllCalculatorPage({ params }: { params: { slug: string[] } }) {
  const pageName = params.slug.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="flex items-center justify-center h-full">
        <Card className="max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4 w-fit">
                    <Wrench className="h-8 w-8" />
                </div>
                <CardTitle>{pageName} Calculator</CardTitle>
                <CardDescription>This calculator is under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>We're working hard to bring you this feature. Please check back soon!</p>
            </CardContent>
        </Card>
    </div>
  );
}
