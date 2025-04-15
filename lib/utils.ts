import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EXPENSE_CATEGORIES, INVESTMENT_TYPES } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryLabel(categoryValue: string): string {
  const category = EXPENSE_CATEGORIES.find((c) => c.value === categoryValue)
  return category ? category.label : categoryValue
}

export function getInvestmentTypeLabel(typeValue: string): string {
  const type = INVESTMENT_TYPES.find((t) => t.value === typeValue)
  return type ? type.label : typeValue
}
