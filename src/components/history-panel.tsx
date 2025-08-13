
"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Star, Trash2, X } from "lucide-react"
import { useHistory } from "@/hooks/use-history"
import { useFavorites } from "@/hooks/use-favorites"
import { ScrollArea } from "./ui/scroll-area"
import Link from "next/link"

export function HistoryPanel() {
  const { history, clearHistory, isInitialized: isHistoryInitialized } = useHistory();
  const { favorites, removeFavorite, isInitialized: areFavoritesInitialized } = useFavorites();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <History className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>
            Review your recent calculations and favorite calculators.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="history" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" /> History
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="mr-2 h-4 w-4" /> Favorites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="flex-grow flex flex-col mt-4">
            <ScrollArea className="flex-grow pr-4">
              {isHistoryInitialized && history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="text-sm">
                      <p className="text-muted-foreground truncate">{item.expression}</p>
                      <p className="text-lg font-semibold">{item.result}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <History className="h-12 w-12 mb-4" />
                  <p className="font-semibold">No history yet</p>
                  <p className="text-sm">Your recent calculations will appear here.</p>
                </div>
              )}
            </ScrollArea>
            {history.length > 0 && (
              <SheetFooter className="pt-4">
                <Button variant="outline" onClick={clearHistory}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
              </SheetFooter>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="flex-grow flex flex-col mt-4">
            <ScrollArea className="flex-grow pr-4">
            {areFavoritesInitialized && favorites.length > 0 ? (
                <div className="space-y-2">
                  {favorites.map((fav) => (
                    <div key={fav.path} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <SheetClose asChild>
                        <Link href={fav.path} className="flex-grow">
                            <div className="flex items-center gap-3">
                              <fav.icon className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-semibold">{fav.name}</p>
                                <p className="text-xs text-muted-foreground">{fav.description}</p>
                              </div>
                            </div>
                        </Link>
                      </SheetClose>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeFavorite(fav.path)}>
                        <X className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Star className="h-12 w-12 mb-4" />
                  <p className="font-semibold">No favorites yet</p>
                  <p className="text-sm">Star calculators to add them here for quick access.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
