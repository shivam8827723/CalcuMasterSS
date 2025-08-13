
"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Youtube, Instagram, Facebook } from "lucide-react"
import { useEffect, useState } from "react"

export function AppFooter() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <Separator className="my-2" />
            <div className="flex items-center justify-center gap-2 p-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://youtube.com/@ssmusic-ai" target="_blank" aria-label="YouTube Music">
                        <Youtube className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://www.youtube.com/@BattleBrigadier98" target="_blank" aria-label="YouTube">
                        <Youtube className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://instagram.com/battlebrigadier98?igsh=MXdramlnN2dmOWtoNQ==" target="_blank" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://facebook.com/profile.php?id=61557404523449&mibextid=JRoKGi" target="_blank" aria-label="Facebook">
                        <Facebook className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
            <div className="px-4 pb-2 text-center text-xs text-muted-foreground">
                <p>© {year} CalcuMaster SS. All rights reserved.</p>
                <p className="mt-1">Owned &amp; Developed by <span className="font-semibold text-foreground">Shivam Sharma</span></p>
            </div>
        </>
    );
}
