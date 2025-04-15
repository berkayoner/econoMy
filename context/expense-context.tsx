"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// Sample data
const sampleExpenses = [
  {
    id: "1",
    amount: 120.5,
    date: new Date(2023, 3, 15),
    description: "Grocery shopping at Whole Foods",
    category: "groceries",
  },
  {
    id: "2",
    amount: 45.0,
    date: new Date(2023, 3, 18),
    description: "Gas station fill-up",
    category: "fuel",
  },
  {
    id: "3",
    amount: 1200.0,
    date: new Date(2023, 3, 1),
    description: "Monthly rent payment",
    category: "housing",
  },
  {
    id: "4",
    amount: 65.99,
    date: new Date(2023, 3, 10),
    description: "Internet bill",
    category: "utilities",
  },
  {
    id: "5",
    amount: 89.99,
    date: new Date(2023, 3, 22),
    description: "Phone bill",
    category: "utilities",
  },
  {
    id: "6",
    amount: 35.4,
    date: new Date(2023, 3, 5),
    description: "Coffee shop with friends",
    category: "entertainment",
  },
  {
    id: "7",
    amount: 120.0,
    date: new Date(2023, 2, 15),
    description: "Grocery shopping",
    category: "groceries",
  },
  {
    id: "8",
    amount: 1200.0,
    date: new Date(2023, 2, 1),
    description: "Monthly rent payment",
    category: "housing",
  },
  {
    id: "9",
    amount: 200.0,
    date: new Date(2023, 2, 10),
    description: "Electricity bill",
    category: "utilities",
  },
  {
    id: "10",
    amount: 50.0,
    date: new Date(2023, 1, 20),
    description: "Restaurant dinner",
    category: "food",
  },
  {
    id: "11",
    amount: 1200.0,
    date: new Date(2023, 1, 1),
    description: "Monthly rent payment",
    category: "housing",
  },
  {
    id: "12",
    amount: 300.0,
    date: new Date(2023, 0, 15),
    description: "Car insurance",
    category: "insurance",
  },
  {
    id: "13",
    amount: 1200.0,
    date: new Date(2023, 0, 1),
    description: "Monthly rent payment",
    category: "housing",
  },
  {
    id: "14",
    amount: 150.0,
    date: new Date(2022, 11, 25),
    description: "Christmas gifts",
    category: "shopping",
  },
  {
    id: "15",
    amount: 1200.0,
    date: new Date(2022, 11, 1),
    description: "Monthly rent payment",
    category: "housing",
  },
]

type Expense = {
  id: string
  amount: number
  date: Date
  description: string
  category: string
}

type ExpenseContextType = {
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  totalExpenses: number
  getMonthlyTotal: (month: number, year: number) => number
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Initialize with sample data
  useEffect(() => {
    // In a real app, you would fetch from localStorage or an API
    setExpenses(sampleExpenses)
  }, [])

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense])
  }

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getMonthlyTotal = (month: number, year: number) => {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        totalExpenses,
        getMonthlyTotal,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}
