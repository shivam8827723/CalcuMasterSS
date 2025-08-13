
"use client"

import { calculatorCategories } from "@/lib/calculator-config";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {calculatorCategories.map((category) => (
        <SidebarMenuItem key={category.name}>
          <SidebarMenuButton
            asChild
            isActive={category.calculators.some(calc => pathname.startsWith(calc.path))}
            className="justify-start"
          >
            <Link href={category.calculators[0]?.path ?? '#'}>
              <category.icon className="h-5 w-5" />
              <span>{category.name}</span>
            </Link>
          </SidebarMenuButton>
          {category.calculators.length > 1 && (
            <SidebarMenuSub>
              {category.calculators.map((calc) => (
                <SidebarMenuSubItem key={calc.name}>
                  <SidebarMenuSubButton asChild isActive={pathname === calc.path}>
                    <Link href={calc.path}>{calc.name}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
