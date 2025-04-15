"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useCurrency } from "@/context/currency-context"

// Sample data
const sampleInvestments = [
  {
    id: "1",
    type: "usd",
    amount: 1000,
    purchaseDate: new Date(2023, 1, 15),
    purchasePrice: 27.5, // TRY per USD at purchase time
    description: "USD Yatırımı",
  },
  {
    id: "2",
    type: "eur",
    amount: 500,
    purchaseDate: new Date(2023, 2, 10),
    purchasePrice: 30.2, // TRY per EUR at purchase time
    description: "Euro Yatırımı",
  },
  {
    id: "3",
    type: "gold",
    amount: 10, // grams
    purchaseDate: new Date(2023, 0, 5),
    purchasePrice: 1850, // TRY per gram at purchase time
    description: "Gram Altın Yatırımı",
  },
]

type Investment = {
  id: string
  type: string
  amount: number
  purchaseDate: Date
  purchasePrice: number // Price in TRY at purchase time
  description: string
}

type InvestmentContextType = {
  investments: Investment[]
  addInvestment: (investment: Investment) => void
  updateInvestment: (investment: Investment) => void
  deleteInvestment: (id: string) => void
  totalInvestmentValue: (currentRates: Record<string, number>) => number
  getCurrentValue: (investment: Investment, currentRates: Record<string, number>) => number
  getProfit: (investment: Investment, currentRates: Record<string, number>) => number
  getProfitPercentage: (investment: Investment, currentRates: Record<string, number>) => number
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const { convertAmount } = useCurrency()

  // Initialize with sample data
  useEffect(() => {
    // In a real app, you would fetch from localStorage or an API
    setInvestments(sampleInvestments)
  }, [])

  const addInvestment = (investment: Investment) => {
    setInvestments((prev) => [...prev, investment])
  }

  const updateInvestment = (updatedInvestment: Investment) => {
    setInvestments((prev) =>
      prev.map((investment) => (investment.id === updatedInvestment.id ? updatedInvestment : investment)),
    )
  }

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((investment) => investment.id !== id))
  }

  // Calculate current value of an investment based on current exchange rates
  const getCurrentValue = (investment: Investment, currentRates: Record<string, number>) => {
    if (investment.type === "usd") {
      return investment.amount * (currentRates["USD"] || investment.purchasePrice)
    } else if (investment.type === "eur") {
      return investment.amount * (currentRates["EUR"] || investment.purchasePrice)
    } else if (investment.type === "gold") {
      // Assuming gold rate is in TRY per gram
      return investment.amount * (currentRates["XAU"] || investment.purchasePrice)
    } else {
      // For other investment types, just return the purchase value
      return investment.amount * investment.purchasePrice
    }
  }

  // Calculate profit/loss for an investment
  const getProfit = (investment: Investment, currentRates: Record<string, number>) => {
    const currentValue = getCurrentValue(investment, currentRates)
    const purchaseValue = investment.amount * investment.purchasePrice
    return currentValue - purchaseValue
  }

  // Calculate profit/loss percentage
  const getProfitPercentage = (investment: Investment, currentRates: Record<string, number>) => {
    const currentValue = getCurrentValue(investment, currentRates)
    const purchaseValue = investment.amount * investment.purchasePrice
    return ((currentValue - purchaseValue) / purchaseValue) * 100
  }

  // Calculate total investment value
  const totalInvestmentValue = (currentRates: Record<string, number>) => {
    return investments.reduce((total, investment) => total + getCurrentValue(investment, currentRates), 0)
  }

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        totalInvestmentValue,
        getCurrentValue,
        getProfit,
        getProfitPercentage,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  )
}

export function useInvestment() {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error("useInvestment must be used within an InvestmentProvider")
  }
  return context
}
