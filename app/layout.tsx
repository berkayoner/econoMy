import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ExpenseProvider } from "@/context/expense-context"
import { CurrencyProvider } from "@/context/currency-context"
import { InvestmentProvider } from "@/context/investment-context"
import { TR } from "@/lib/translations"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: TR.appName,
  description: "Harcamalarınızı takip edin ve finansal öngörüler elde edin",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <ExpenseProvider>
              <InvestmentProvider>{children}</InvestmentProvider>
            </ExpenseProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'