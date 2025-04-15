"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { CURRENCIES } from "@/lib/constants"

type Currency = {
  code: string
  symbol: string
  name: string
}

type CurrencyContextType = {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  exchangeRates: Record<string, number>
  setExchangeRates: (rates: Record<string, number>) => void
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number
  fetchExchangeRates: () => Promise<void>
  lastUpdated: Date | null
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Default to Turkish Lira
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0])
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    try {
      // In a real app, you would use a proper API with TRY as base
      // For now, we'll use mock data
      const mockRates: Record<string, number> = {
        USD: 32.5, // 1 USD = 32.5 TRY
        EUR: 35.2, // 1 EUR = 35.2 TRY
        GBP: 41.8, // 1 GBP = 41.8 TRY
        JPY: 0.22, // 1 JPY = 0.22 TRY
        XAU: 2150, // 1 gram gold = 2150 TRY
      }

      setExchangeRates(mockRates)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error)
    }
  }

  // Convert amount between currencies
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) {
      return amount
    }

    // If converting from TRY to another currency
    if (fromCurrency === "TRY") {
      return amount / (exchangeRates[toCurrency] || 1)
    }

    // If converting to TRY from another currency
    if (toCurrency === "TRY") {
      return amount * (exchangeRates[fromCurrency] || 1)
    }

    // If converting between two non-TRY currencies
    // First convert to TRY, then to target currency
    const amountInTRY = amount * (exchangeRates[fromCurrency] || 1)
    return amountInTRY / (exchangeRates[toCurrency] || 1)
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        exchangeRates,
        setExchangeRates,
        convertAmount,
        fetchExchangeRates,
        lastUpdated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
