
"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search, Star } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { HistoryPanel } from "./history-panel"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { useFavorites } from "@/hooks/use-favorites"
import { calculatorCategories } from "@/lib/calculator-config"
import { useMemo, useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSidebar } from "./ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
  const pathname = usePathname();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentCalculator = useMemo(() => {
    return calculatorCategories.flatMap(c => c.calculators).find(calc => calc.path === pathname);
  }, [pathname]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return calculatorCategories
      .flatMap(category => category.calculators)
      .filter(calc => calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || calc.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchItemClick = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }

  useEffect(() => {
    handleSearchItemClick();
  }, [pathname]);

  const isFav = currentCalculator ? isFavorite(currentCalculator.path) : false;

  const handleFavoriteToggle = () => {
    if (currentCalculator) {
      if (isFav) {
        removeFavorite(currentCalculator.path);
      } else {
        addFavorite(currentCalculator);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <SidebarTrigger className={isMobile ? "" : "md:hidden"} />
        </div>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial" ref={searchRef}>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for a calculator..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchOpen(true)}
                    />
                    {isSearchOpen && searchResults.length > 0 && (
                      <div className="absolute top-full mt-2 w-full max-w-[300px] rounded-md border bg-popover text-popover-foreground shadow-md z-50">
                        <ul className="max-h-80 overflow-y-auto p-1">
                          {searchResults.map((calc) => (
                            <li key={calc.path}>
                              <Link 
                                href={calc.path} 
                                className="flex items-center gap-3 p-2 rounded-sm hover:bg-accent"
                                onClick={handleSearchItemClick}
                              >
                                <calc.icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-semibold text-sm">{calc.name}</p>
                                  <p className="text-xs text-muted-foreground">{calc.description}</p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
            </div>
            {currentCalculator && (
              <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} aria-label="Toggle Favorite">
                <Star className={isFav ? "fill-accent text-accent" : ""} />
              </Button>
            )}
            <ThemeToggle />
            <HistoryPanel />
        </div>
    </header>
  )
}
