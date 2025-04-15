import type { Metadata } from "next"
import { ExpenseManagement } from "@/components/expense-management"

export const metadata: Metadata = {
  title: "Expenses | Personal Finance Manager",
  description: "Manage your expenses",
}

export default function ExpensesPage() {
  return (
    <main className="min-h-screen bg-background">
      <ExpenseManagement />
    </main>
  )
}
