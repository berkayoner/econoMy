"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { useInvestment } from "@/context/investment-context"
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
import { InvestmentForm } from "@/components/investment-form"
import { getInvestmentTypeLabel } from "@/lib/utils"
import { TR } from "@/lib/translations"

export function InvestmentList() {
  const { investments, deleteInvestment, getCurrentValue, getProfit, getProfitPercentage } = useInvestment()
  const { exchangeRates, selectedCurrency } = useCurrency()
  const [editingInvestment, setEditingInvestment] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null)

  // Sort by date (newest first)
  const sortedInvestments = [...investments].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime(),
  )

  const handleEdit = (investment: any) => {
    setEditingInvestment(investment)
  }

  const handleDelete = (id: string) => {
    setInvestmentToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (investmentToDelete) {
      deleteInvestment(investmentToDelete)
      setIsDeleteDialogOpen(false)
      setInvestmentToDelete(null)
    }
  }

  return (
    <>
      {sortedInvestments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">{TR.noInvestmentsFound}</p>
          <p className="mt-2 text-sm text-muted-foreground">{TR.addYourFirstInvestment}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{TR.investmentType}</TableHead>
                <TableHead>{TR.purchaseDate}</TableHead>
                <TableHead>{TR.quantity}</TableHead>
                <TableHead>{TR.purchasePrice}</TableHead>
                <TableHead>{TR.currentValue}</TableHead>
                <TableHead>{TR.profit}</TableHead>
                <TableHead className="text-right">{TR.actionsColumn}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestments.map((investment) => {
                const currentValue = getCurrentValue(investment, exchangeRates)
                const profit = getProfit(investment, exchangeRates)
                const profitPercentage = getProfitPercentage(investment, exchangeRates)
                const isProfitable = profit >= 0

                return (
                  <TableRow key={investment.id}>
                    <TableCell>{getInvestmentTypeLabel(investment.type)}</TableCell>
                    <TableCell>{format(new Date(investment.purchaseDate), "d MMMM yyyy", { locale: tr })}</TableCell>
                    <TableCell>{investment.amount}</TableCell>
                    <TableCell>
                      {selectedCurrency.symbol}
                      {investment.purchasePrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {selectedCurrency.symbol}
                      {currentValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={isProfitable ? "text-green-600" : "text-red-600"}>
                        {isProfitable ? "+" : ""}
                        {selectedCurrency.symbol}
                        {profit.toFixed(2)} ({isProfitable ? "+" : ""}
                        {profitPercentage.toFixed(2)}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(investment)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{TR.edit}</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(investment.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{TR.delete}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      {editingInvestment && (
        <Dialog open={!!editingInvestment} onOpenChange={(open) => !open && setEditingInvestment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{TR.editInvestment}</DialogTitle>
              <DialogDescription>{TR.editInvestmentDesc}</DialogDescription>
            </DialogHeader>
            <InvestmentForm investment={editingInvestment} onSuccess={() => setEditingInvestment(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{TR.confirmDeletion}</DialogTitle>
            <DialogDescription>{TR.confirmDeletionDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {TR.cancel}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {TR.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
