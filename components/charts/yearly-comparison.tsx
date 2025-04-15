"use client"

import { useMemo } from "react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function YearlyComparison({ height = 350 }: { height?: number }) {
  const { expenses } = useExpense()
  const { selectedCurrency } = useCurrency()

  const data = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = [currentYear - 2, currentYear - 1, currentYear]

    // Initialize data structure
    const yearlyData = years.map((year) => ({
      name: year.toString(),
      total: 0,
    }))

    // Populate with actual expense data
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const year = date.getFullYear()

      const yearIndex = years.indexOf(year)
      if (yearIndex !== -1) {
        yearlyData[yearIndex].total += expense.amount
      }
    })

    return yearlyData
  }, [expenses])

  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Expenses",
          color: "hsl(var(--chart-1))",
        },
      }}
      className={`h-[${height}px]`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${selectedCurrency.symbol}${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="total" fill="var(--color-total)" name="Total Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
