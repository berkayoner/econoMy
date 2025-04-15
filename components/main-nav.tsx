"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { TR } from "@/lib/translations"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">{TR.appName}</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {TR.dashboard}
            </Link>
            <Link
              href="/expenses"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/expenses" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {TR.expenses}
            </Link>
            <Link
              href="/investments"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/investments" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {TR.investments}
            </Link>
            <Link
              href="/analytics"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/analytics" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {TR.analytics}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <CurrencySelector />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
