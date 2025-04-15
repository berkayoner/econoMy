"use client"

import { useCurrency } from "@/context/currency-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/lib/constants"

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency()

  const handleCurrencyChange = (value: string) => {
    const currency = CURRENCIES.find((c) => c.code === value)
    if (currency) {
      setSelectedCurrency(currency)
    }
  }

  return (
    <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
