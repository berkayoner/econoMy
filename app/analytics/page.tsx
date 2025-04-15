import type { Metadata } from "next"
import { Analytics } from "@/components/analytics"

export const metadata: Metadata = {
  title: "Analytics | Personal Finance Manager",
  description: "Analyze your financial data",
}

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Analytics />
    </main>
  )
}
