
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Calculator } from "lucide-react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { AppFooter } from '@/components/app-footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2" aria-label="Return to homepage">
            <Calculator className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">CalcuMaster SS</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
            <AppFooter />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex justify-center">
            {children}
          </main>
          <footer className="p-4 text-center text-xs text-muted-foreground border-t md:hidden">
              <AppFooter />
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
