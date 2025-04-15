"use client"

import { useMemo } from "react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function MonthlyOverview({ height = 350 }: { height?: number }) {
  const { expenses } = useExpense()
  const { selectedCurrency } = useCurrency()

  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    // Initialize data for all months
    const monthlyData = months.map((month, index) => ({
      name: month,
      currentYear: 0,
      previousYear: 0,
      month: index,
    }))

    // Populate with actual expense data
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const month = date.getMonth()
      const year = date.getFullYear()

      if (year === currentYear) {
        monthlyData[month].currentYear += expense.amount
      } else if (year === lastYear) {
        monthlyData[month].previousYear += expense.amount
      }
    })

    return monthlyData
  }, [expenses])

  return (
    <ChartContainer
      config={{
        currentYear: {
          label: `${new Date().getFullYear()} Expenses`,
          color: "hsl(var(--chart-1))",
        },
        previousYear: {
          label: `${new Date().getFullYear() - 1} Expenses`,
          color: "hsl(var(--chart-2))",
        },
      }}
      className={`h-[${height}px]`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${selectedCurrency.symbol}${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="currentYear"
            stroke="var(--color-currentYear)"
            name={`${new Date().getFullYear()} Expenses`}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="previousYear"
            stroke="var(--color-previousYear)"
            name={`${new Date().getFullYear() - 1} Expenses`}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
