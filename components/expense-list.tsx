"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { useExpense } from "@/context/expense-context"
import { useCurrency } from "@/context/currency-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExpenseForm } from "@/components/expense-form"
import { getCategoryLabel } from "@/lib/utils"

interface ExpenseListProps {
  limit?: number
  filterOptions?: {
    category: string
    dateRange: string
    amountRange: number[]
  }
}

export function ExpenseList({ limit, filterOptions }: ExpenseListProps) {
  const { expenses, deleteExpense } = useExpense()
  const { selectedCurrency } = useCurrency()
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

  // Apply filters if provided
  let filteredExpenses = [...expenses]

  if (filterOptions) {
    if (filterOptions.category !== "all") {
      filteredExpenses = filteredExpenses.filter((expense) => expense.category === filterOptions.category)
    }

    if (filterOptions.dateRange !== "all") {
      const now = new Date()
      const startDate = new Date()

      if (filterOptions.dateRange === "today") {
        startDate.setHours(0, 0, 0, 0)
      } else if (filterOptions.dateRange === "week") {
        startDate.setDate(now.getDate() - 7)
      } else if (filterOptions.dateRange === "month") {
        startDate.setMonth(now.getMonth() - 1)
      } else if (filterOptions.dateRange === "year") {
        startDate.setFullYear(now.getFullYear() - 1)
      }

      filteredExpenses = filteredExpenses.filter((expense) => new Date(expense.date) >= startDate)
    }

    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.amount >= filterOptions.amountRange[0] && expense.amount <= filterOptions.amountRange[1],
    )
  }

  // Sort by date (newest first)
  filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Apply limit if provided
  if (limit) {
    filteredExpenses = filteredExpenses.slice(0, limit)
  }

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
  }

  const handleDelete = (id: string) => {
    setExpenseToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete)
      setIsDeleteDialogOpen(false)
      setExpenseToDelete(null)
    }
  }

  return (
    <>
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{getCategoryLabel(expense.category)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {selectedCurrency.symbol}
                    {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      {editingExpense && (
        <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>Make changes to your expense here.</DialogDescription>
            </DialogHeader>
            <ExpenseForm expense={editingExpense} onSuccess={() => setEditingExpense(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
