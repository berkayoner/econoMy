"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentForm } from "@/components/investment-form"
import { InvestmentList } from "@/components/investment-list"
import { InvestmentDistribution } from "@/components/charts/investment-distribution"
import { InvestmentPerformance } from "@/components/charts/investment-performance"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useInvestment } from "@/context/investment-context"
import { useCurrency } from "@/context/currency-context"
import { TR } from "@/lib/translations"

export function InvestmentManagement() {
  const [isMobile, setIsMobile] = useState(false)
  const { investments, totalInvestmentValue } = useInvestment()
  const { exchangeRates, selectedCurrency } = useCurrency()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{TR.investments}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{TR.totalInvestments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedCurrency.symbol}
                {totalInvestmentValue(exchangeRates).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{TR.currentValue}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{TR.allInvestments}</TabsTrigger>
            <TabsTrigger value="add">{TR.addInvestment}</TabsTrigger>
            <TabsTrigger value="analytics">{TR.analytics}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{TR.investments}</CardTitle>
                <CardDescription>{TR.trackInvestments}</CardDescription>
              </CardHeader>
              <CardContent>
                <InvestmentList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{TR.addInvestment}</CardTitle>
                <CardDescription>{TR.trackInvestments}</CardDescription>
              </CardHeader>
              <CardContent>
                <InvestmentForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{TR.investmentDistribution}</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentDistribution />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{TR.investmentPerformance}</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentPerformance />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
