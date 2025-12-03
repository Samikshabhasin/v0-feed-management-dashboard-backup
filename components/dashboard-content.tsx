"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { SegmentBuilder } from "./segment-builder"
import { SegmentResults } from "./segment-results"
import { ProductTrendGraph } from "./product-trend-graph"
import { PerformanceChart } from "./performance-chart"
import { FeedSourcesChart } from "./feed-sources-chart"
import { VisibilityChart } from "./visibility-chart"
import { OpportunitySignals } from "./opportunity-signals"
import { ProblemProductsAlert } from "./problem-products-alert"
import { VisibilityScoreCard } from "./visibility-score-card"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/types/product"

function getRandomProducts(products: Product[], count: number): Product[] {
  const shuffled = [...products].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function DashboardContent() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [dashboardDateRange, setDashboardDateRange] = useState("30")

  const handleProductsSelected = (products: Product[]) => {
    console.log("[v0] Products selected:", products.length)
    setSelectedProducts(products)
  }

  const handleClearFilters = () => {
    console.log("[v0] Clear filters called")

    const randomProducts = getRandomProducts(mockProducts, Math.min(5, mockProducts.length))
    console.log(
      "[v0] Random products selected:",
      randomProducts.map((p) => p.name),
    )

    setSelectedProducts(randomProducts)
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Main Date Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and optimize your product feed performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Dashboard Dates:</Label>
          <Select value={dashboardDateRange} onValueChange={setDashboardDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VisibilityScoreCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Google, Facebook, Amazon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <ProblemProductsAlert />

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Feed Sources</CardTitle>
            <CardDescription>Distribution across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedSourcesChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visibility Trends</CardTitle>
            <CardDescription>Product visibility across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <VisibilityChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Opportunity Signals</CardTitle>
            <CardDescription>AI-powered optimization suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <OpportunitySignals />
          </CardContent>
        </Card>
      </div>

      {/* Segment Builder */}
      <SegmentBuilder
        products={mockProducts}
        onSegmentSaved={handleProductsSelected}
        onLoadProducts={handleProductsSelected}
        onClearFilters={handleClearFilters}
      />

      {/* Segment Results */}
      {selectedProducts.length > 0 && <SegmentResults products={selectedProducts} />}

      {/* Performance Trends */}
      <ProductTrendGraph products={selectedProducts} dateRange={dashboardDateRange} />
    </div>
  )
}
