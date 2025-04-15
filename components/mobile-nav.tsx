"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { TR } from "@/lib/translations"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">{TR.appName}</span>
            </Link>
            <div className="my-4">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {TR.dashboard}
                </Link>
                <Link
                  href="/expenses"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/expenses" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {TR.expenses}
                </Link>
                <Link
                  href="/investments"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/investments" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {TR.investments}
                </Link>
                <Link
                  href="/analytics"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/analytics" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {TR.analytics}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block">KFY</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <CurrencySelector />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
