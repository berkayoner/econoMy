import type { Metadata } from "next"
import { InvestmentManagement } from "@/components/investment-management"
import { TR } from "@/lib/translations"

export const metadata: Metadata = {
  title: `${TR.investments} | ${TR.appName}`,
  description: TR.trackInvestments,
}

export default function InvestmentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <InvestmentManagement />
    </main>
  )
}
