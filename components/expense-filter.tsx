"use client"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { EXPENSE_CATEGORIES } from "@/lib/constants"

interface ExpenseFilterProps {
  filterOptions: {
    category: string
    dateRange: string
    amountRange: number[]
  }
  setFilterOptions: (options: any) => void
}

export function ExpenseFilter({ filterOptions, setFilterOptions }: ExpenseFilterProps) {
  const handleCategoryChange = (value: string) => {
    setFilterOptions({
      ...filterOptions,
      category: value,
    })
  }

  const handleDateRangeChange = (value: string) => {
    setFilterOptions({
      ...filterOptions,
      dateRange: value,
    })
  }

  const handleAmountRangeChange = (value: number[]) => {
    setFilterOptions({
      ...filterOptions,
      amountRange: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category-filter">Category</Label>
        <Select value={filterOptions.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-filter">Date Range</Label>
        <Select value={filterOptions.dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger id="date-filter">
            <SelectValue placeholder="Select a date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Amount Range</Label>
          <span className="text-sm text-muted-foreground">
            ${filterOptions.amountRange[0]} - ${filterOptions.amountRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={filterOptions.amountRange}
          max={10000}
          step={100}
          onValueChange={handleAmountRangeChange}
        />
      </div>
    </div>
  )
}
