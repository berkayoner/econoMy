"use client"

import { useMemo } from "react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getCategoryLabel } from "@/lib/utils"

export function CategoryBreakdown({ height = 350 }: { height?: number }) {
  const { expenses } = useExpense()
  const { selectedCurrency } = useCurrency()

  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    // Get expenses from the current month only
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Group by category
    currentMonthExpenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0
      }
      categoryTotals[expense.category] += expense.amount
    })

    // Convert to array format for the chart
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: amount,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    }))
  }, [expenses])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
              <span className="font-bold text-foreground">{payload[0].name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">
                {selectedCurrency.symbol}
                {payload[0].value.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[350px] w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
