"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseFilter } from "@/components/expense-filter"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

export function ExpenseManagement() {
  const [isMobile, setIsMobile] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    category: "all",
    dateRange: "all",
    amountRange: [0, 10000],
  })

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Expense Management</h2>
        </div>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>View and manage all your recorded expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList filterOptions={filterOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record a new expense with details</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="filter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filter Expenses</CardTitle>
                <CardDescription>Filter your expenses by category, date, or amount</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseFilter filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Filtered Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseList filterOptions={filterOptions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
