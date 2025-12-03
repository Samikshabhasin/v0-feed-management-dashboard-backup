"use client" 

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

export const ForceDynamic = "force-dynamic"

const SidebarProvider = dynamic(
  () => import("@/components/ui/sidebar").then((mod) => ({ default: mod.SidebarProvider })),
  { ssr: false },
)
const SidebarTrigger = dynamic(
  () => import("@/components/ui/sidebar").then((mod) => ({ default: mod.SidebarTrigger })),
  { ssr: false },
)

const DashboardContent = dynamic(
  () => import("@/components/dashboard-content").then((mod) => ({ default: mod.DashboardContent })),
  { ssr: false },
)
const DiagnosePage = dynamic(() => import("@/components/diagnose-page"), { ssr: false })
const OptimizePage = dynamic(
  () => import("@/components/optimize-page").then((mod) => ({ default: mod.OptimizePage })),
  { ssr: false },
)
const ImpactPage = dynamic(() => import("@/components/impact-page").then((mod) => ({ default: mod.ImpactPage })), {
  ssr: false,
})

const DynamicAppSidebar = dynamic(
  () => import("@/components/app-sidebar").then((mod) => ({ default: mod.AppSidebar })),
  {
    ssr: false,
  },
)

export default function Page() {
  const [activeView, setActiveView] = useState("dashboard")

  // Listen for hash changes to switch views
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setActiveView(hash)
      }
    }

    // Set initial view based on hash
    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const renderContent = () => {
    switch (activeView) {
      case "diagnose":
        return <DiagnosePage />
      case "optimize":
        return <OptimizePage />
      case "impact":
        return <ImpactPage />
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider>
      <DynamicAppSidebar onViewChange={setActiveView} activeView={activeView} />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl font-semibold">Statasphere | Channel Intelligence</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered visibility and performance diagnostics across every channel.
            </p>
          </div>
        </div>
        <div className="px-4 py-2">{renderContent()}</div>
      </main>
    </SidebarProvider>
  )
}
