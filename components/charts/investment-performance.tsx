"use client"

import { useMemo } from "react"
import { useInvestment } from "@/context/investment-context"
import { useCurrency } from "@/context/currency-context"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { getInvestmentTypeLabel } from "@/lib/utils"
import { TR } from "@/lib/translations"

export function InvestmentPerformance({ height = 350 }: { height?: number }) {
  const { investments, getCurrentValue } = useInvestment()
  const { exchangeRates, selectedCurrency } = useCurrency()

  const data = useMemo(() => {
    return investments.map((investment) => {
      const purchaseValue = investment.amount * investment.purchasePrice
      const currentValue = getCurrentValue(investment, exchangeRates)
      const profit = currentValue - purchaseValue

      return {
        name: getInvestmentTypeLabel(investment.type),
        purchaseValue,
        currentValue,
        profit,
      }
    })
  }, [investments, exchangeRates, getCurrentValue])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{TR.investmentType}</span>
              <span className="font-bold text-foreground">{payload[0].payload.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{TR.purchasePrice}</span>
              <span className="font-bold text-foreground">
                {selectedCurrency.symbol}
                {payload[0].value.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{TR.currentValue}</span>
              <span className="font-bold text-foreground">
                {selectedCurrency.symbol}
                {payload[1].value.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{TR.profit}</span>
              <span className={`font-bold ${payload[2].value >= 0 ? "text-green-600" : "text-red-600"}`}>
                {payload[2].value >= 0 ? "+" : ""}
                {selectedCurrency.symbol}
                {payload[2].value.toFixed(2)}
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
          <p className="text-sm text-muted-foreground">{TR.noDataAvailable}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${selectedCurrency.symbol}${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="purchaseValue" name={TR.purchasePrice} fill="#8884d8" />
            <Bar dataKey="currentValue" name={TR.currentValue} fill="#82ca9d" />
            <Bar dataKey="profit" name={TR.profit} fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
