"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlyOverview } from "@/components/charts/monthly-overview"
import { CategoryBreakdown } from "@/components/charts/category-breakdown"
import { YearlyComparison } from "@/components/charts/yearly-comparison"
import { TrendAnalysis } from "@/components/charts/trend-analysis"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

export function Analytics() {
  const [isMobile, setIsMobile] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
        </div>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Overview</CardTitle>
                <CardDescription>Track your monthly spending patterns</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MonthlyOverview height={400} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="yearly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yearly Comparison</CardTitle>
                <CardDescription>Compare your expenses across different years</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <YearlyComparison height={400} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>See how your expenses are distributed across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown height={400} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Analyze your spending trends over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TrendAnalysis height={400} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
