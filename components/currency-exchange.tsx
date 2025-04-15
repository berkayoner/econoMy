"use client"

import { useEffect, useState } from "react"
import { useCurrency } from "@/context/currency-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/lib/constants"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, RefreshCw } from "lucide-react"
import { TR } from "@/lib/translations"

export function CurrencyExchange() {
  const { exchangeRates, fetchExchangeRates, lastUpdated, selectedCurrency } = useCurrency()
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("TRY")
  const [toCurrency, setToCurrency] = useState("USD")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshRates = async () => {
    setIsLoading(true)
    try {
      await fetchExchangeRates()
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) {
      handleRefreshRates()
    }
  }, [])

  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const convertedAmount = () => {
    if (isLoading) return "Yükleniyor..."

    if (fromCurrency === "TRY" && toCurrency === "TRY") {
      return amount
    }

    if (fromCurrency === "TRY") {
      // Converting from TRY to another currency
      if (!exchangeRates[toCurrency]) return "Kur bulunamadı"
      const result = Number.parseFloat(amount) / exchangeRates[toCurrency]
      return isNaN(result) ? "Geçersiz tutar" : result.toFixed(2)
    } else if (toCurrency === "TRY") {
      // Converting from another currency to TRY
      if (!exchangeRates[fromCurrency]) return "Kur bulunamadı"
      const result = Number.parseFloat(amount) * exchangeRates[fromCurrency]
      return isNaN(result) ? "Geçersiz tutar" : result.toFixed(2)
    } else {
      // Converting between two non-TRY currencies
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return "Kur bulunamadı"
      const amountInTRY = Number.parseFloat(amount) * exchangeRates[fromCurrency]
      const result = amountInTRY / exchangeRates[toCurrency]
      return isNaN(result) ? "Geçersiz tutar" : result.toFixed(2)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">{TR.amount}</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Tutar girin" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{TR.fromCurrency}</label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={TR.selectCurrency} />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center md:col-span-2">
          <Button variant="outline" size="icon" onClick={handleSwapCurrencies}>
            <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
          </Button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{TR.toCurrency}</label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={TR.selectCurrency} />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{TR.convertedAmount}</label>
          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {isLoading ? "Yükleniyor..." : convertedAmount()}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {lastUpdated && `${TR.lastUpdated}: ${lastUpdated.toLocaleTimeString()}`}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshRates} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {TR.refreshRates}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(exchangeRates)
          .slice(0, 6)
          .map(([code, rate]) => (
            <Card key={code}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{code}</CardTitle>
                <CardDescription>
                  1 {code} = {rate.toFixed(4)} TRY
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  )
}
