"use client"

import { useMemo } from "react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function TrendAnalysis({ height = 350 }: { height?: number }) {
  const { expenses } = useExpense()
  const { selectedCurrency } = useCurrency()

  const data = useMemo(() => {
    // Get the last 12 months
    const months = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        name: d.toLocaleString("default", { month: "short" }) + " " + d.getFullYear(),
      })
    }

    // Initialize data structure
    const trendData = months.map((m) => ({
      name: m.name,
      total: 0,
      average: 0,
      month: m.month,
      year: m.year,
    }))

    // Populate with actual expense data
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const month = date.getMonth()
      const year = date.getFullYear()

      const monthIndex = trendData.findIndex((m) => m.month === month && m.year === year)

      if (monthIndex !== -1) {
        trendData[monthIndex].total += expense.amount
      }
    })

    // Calculate 3-month moving average
    for (let i = 2; i < trendData.length; i++) {
      trendData[i].average = (trendData[i].total + trendData[i - 1].total + trendData[i - 2].total) / 3
    }

    return trendData
  }, [expenses])

  return (
    <ChartContainer
      config={{
        total: {
          label: "Monthly Total",
          color: "hsl(var(--chart-1))",
        },
        average: {
          label: "3-Month Average",
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
          <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Monthly Total" strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="average"
            stroke="var(--color-average)"
            name="3-Month Average"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
