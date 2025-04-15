import type { Metadata } from "next"
import { Dashboard } from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Dashboard | Personal Finance Manager",
  description: "Track your expenses and gain financial insights",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  )
}
