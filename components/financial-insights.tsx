"use client"

import { useEffect, useState } from "react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, TrendingDown, TrendingUp, Lightbulb } from "lucide-react"
import { getCategoryLabel } from "@/lib/utils"

export function FinancialInsights() {
  const { expenses, getMonthlyTotal } = useExpense()
  const { selectedCurrency } = useCurrency()
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (expenses.length === 0) {
      setInsights([
        {
          type: "info",
          title: "No data available",
          description: "Start adding expenses to get personalized financial insights.",
          icon: AlertCircle,
        },
      ])
      setLoading(false)
      return
    }

    // Calculate insights
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthTotal = getMonthlyTotal(currentMonth, currentYear)
    const lastMonthTotal = getMonthlyTotal(lastMonth, lastMonthYear)

    // Group expenses by category for the current month
    const currentMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const categoryTotals: Record<string, number> = {}
    currentMonthExpenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0
      }
      categoryTotals[expense.category] += expense.amount
    })

    // Find top spending category
    let topCategory = ""
    let topAmount = 0
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topAmount) {
        topCategory = category
        topAmount = amount
      }
    })

    // Generate insights
    const newInsights = []

    // Month-over-month comparison
    if (lastMonthTotal > 0) {
      const percentChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100

      if (percentChange > 10) {
        newInsights.push({
          type: "warning",
          title: "Spending Increase",
          description: `Your spending this month is up ${Math.abs(percentChange).toFixed(1)}% compared to last month. Consider reviewing your budget.`,
          icon: TrendingUp,
        })
      } else if (percentChange < -10) {
        newInsights.push({
          type: "success",
          title: "Spending Decrease",
          description: `Great job! Your spending this month is down ${Math.abs(percentChange).toFixed(1)}% compared to last month.`,
          icon: TrendingDown,
        })
      }
    }

    // Category insights
    if (topCategory) {
      const categoryPercentage = (topAmount / currentMonthTotal) * 100
      if (categoryPercentage > 30) {
        newInsights.push({
          type: "warning",
          title: `High ${getCategoryLabel(topCategory)} Spending`,
          description: `${getCategoryLabel(topCategory)} makes up ${categoryPercentage.toFixed(1)}% of your monthly expenses. Consider ways to reduce this category.`,
          icon: AlertCircle,
        })
      }
    }

    // Savings recommendation
    const monthlyIncome = 5000 // Placeholder - in a real app, this would come from user input
    if (currentMonthTotal < monthlyIncome * 0.7) {
      const savingsAmount = monthlyIncome - currentMonthTotal
      newInsights.push({
        type: "success",
        title: "Savings Opportunity",
        description: `You have ${selectedCurrency.symbol}${savingsAmount.toFixed(2)} available for savings this month. Consider investing in a high-yield savings account or index fund.`,
        icon: Lightbulb,
      })
    }

    // Add general tips if we don't have many insights
    if (newInsights.length < 2) {
      newInsights.push({
        type: "default",
        title: "Financial Tip",
        description:
          "Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        icon: Lightbulb,
      })
    }

    setInsights(newInsights)
    setLoading(false)
  }, [expenses, getMonthlyTotal, selectedCurrency])

  if (loading) {
    return <div>Loading insights...</div>
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Alert key={index} variant={insight.type === "default" ? "default" : insight.type}>
          <insight.icon className="h-4 w-4" />
          <AlertTitle>{insight.title}</AlertTitle>
          <AlertDescription>{insight.description}</AlertDescription>
        </Alert>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Investment Recommendations</CardTitle>
          <CardDescription>Based on your financial profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Emergency Fund</h4>
              <p className="text-sm text-muted-foreground">
                Aim to save 3-6 months of expenses in a high-yield savings account for emergencies.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Retirement</h4>
              <p className="text-sm text-muted-foreground">
                Consider contributing to a retirement account like a 401(k) or IRA, especially if your employer offers
                matching.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Index Funds</h4>
              <p className="text-sm text-muted-foreground">
                For long-term growth, consider low-cost index funds that track the overall market.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
