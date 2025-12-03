"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  BarChart3,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Download,
  RefreshCw,
} from "lucide-react"
import type { Product } from "@/types/product"

interface KeywordImplementation {
  id: string
  keyword: string
  productId: string
  productName: string
  implementedDate: string
  suggestionType: "missing_keyword" | "trending_term" | "competitor_term" | "long_tail" | "seasonal" | "brand_variant"
  priority: "high" | "medium" | "low"
  estimatedImpact: number
  status: "active" | "paused" | "removed"
  targetRanking: number
  currentRanking?: number
  confidence: number
}

interface KeywordPerformanceData {
  date: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
  ranking: number
  searchVolume: number
  cost: number
  revenue: number
  roas: number
}

interface KeywordTracking {
  implementation: KeywordImplementation
  performanceHistory: KeywordPerformanceData[]
  currentMetrics: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    conversionRate: number
    ranking: number
    cost: number
    revenue: number
    roas: number
  }
  trends: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    ranking: number
  }
  achievements: {
    targetRankingReached: boolean
    estimatedImpactAchieved: boolean
    roiPositive: boolean
    performanceImproving: boolean
  }
}

interface KeywordPerformanceTrackerProps {
  products: Product[]
}

// Mock implemented keywords data
const generateImplementedKeywords = (): KeywordImplementation[] => {
  const implementations: KeywordImplementation[] = [
    {
      id: "impl-1",
      keyword: "nike running shoes 2024",
      productId: "prod-1",
      productName: "Nike Air Max 270 React",
      implementedDate: "2024-01-15",
      suggestionType: "trending_term",
      priority: "high",
      estimatedImpact: 35,
      status: "active",
      targetRanking: 15,
      currentRanking: 12,
      confidence: 92,
    },
    {
      id: "impl-2",
      keyword: "adidas alternative running shoes",
      productId: "prod-1",
      productName: "Nike Air Max 270 React",
      implementedDate: "2024-01-20",
      suggestionType: "competitor_term",
      priority: "medium",
      estimatedImpact: 22,
      status: "active",
      targetRanking: 12,
      currentRanking: 18,
      confidence: 71,
    },
    {
      id: "impl-3",
      keyword: "winter running shoes 2024",
      productId: "prod-2",
      productName: "Adidas Ultraboost 22",
      implementedDate: "2024-02-01",
      suggestionType: "seasonal",
      priority: "high",
      estimatedImpact: 42,
      status: "active",
      targetRanking: 18,
      currentRanking: 8,
      confidence: 94,
    },
    {
      id: "impl-4",
      keyword: "nike black running shoes size 10",
      productId: "prod-1",
      productName: "Nike Air Max 270 React",
      implementedDate: "2024-02-10",
      suggestionType: "long_tail",
      priority: "medium",
      estimatedImpact: 18,
      status: "active",
      targetRanking: 8,
      currentRanking: 5,
      confidence: 78,
    },
    {
      id: "impl-5",
      keyword: "best athletic shoes",
      productId: "prod-3",
      productName: "New Balance Fresh Foam X",
      implementedDate: "2024-02-15",
      suggestionType: "missing_keyword",
      priority: "high",
      estimatedImpact: 28,
      status: "paused",
      targetRanking: 20,
      currentRanking: 25,
      confidence: 85,
    },
  ]

  return implementations
}

// Generate performance history for keywords
const generatePerformanceHistory = (implementation: KeywordImplementation): KeywordPerformanceData[] => {
  const history: KeywordPerformanceData[] = []
  const startDate = new Date(implementation.implementedDate)
  const today = new Date()

  // Generate daily data from implementation date to today
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const daysSinceStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Simulate performance improvement over time
    const baseImpressions = 1000 + Math.random() * 500
    const improvementFactor = Math.min(1 + daysSinceStart * 0.02, 1.5) // Gradual improvement
    const seasonalFactor = implementation.suggestionType === "seasonal" ? 1.3 : 1

    const impressions = Math.floor(baseImpressions * improvementFactor * seasonalFactor)
    const ctr = Math.min(2 + daysSinceStart * 0.01 + Math.random() * 0.5, 4.5)
    const clicks = Math.floor(impressions * (ctr / 100))
    const conversionRate = Math.min(1 + daysSinceStart * 0.005, 3.5)
    const conversions = Math.floor(clicks * (conversionRate / 100))

    // Ranking improvement over time
    const rankingImprovement = Math.min(daysSinceStart * 0.1, implementation.targetRanking * 0.3)
    const ranking = Math.max(
      implementation.targetRanking - rankingImprovement,
      implementation.currentRanking || implementation.targetRanking,
    )

    history.push({
      date: d.toISOString().split("T")[0],
      impressions,
      clicks,
      ctr: Number(ctr.toFixed(2)),
      conversions,
      conversionRate: Number(conversionRate.toFixed(2)),
      ranking: Math.floor(ranking),
      searchVolume: 5000 + Math.random() * 2000,
      cost: clicks * (0.5 + Math.random() * 1.5),
      revenue: conversions * (50 + Math.random() * 100),
      roas: Number(((conversions * 75) / (clicks * 1.2)).toFixed(2)),
    })
  }

  return history
}

// Generate tracking data
const generateKeywordTracking = (implementations: KeywordImplementation[]): KeywordTracking[] => {
  return implementations.map((implementation) => {
    const performanceHistory = generatePerformanceHistory(implementation)
    const currentMetrics = performanceHistory[performanceHistory.length - 1] || {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      ranking: implementation.targetRanking,
      cost: 0,
      revenue: 0,
      roas: 0,
    }

    // Calculate trends (last 7 days vs previous 7 days)
    const recent = performanceHistory.slice(-7)
    const previous = performanceHistory.slice(-14, -7)

    const calculateTrend = (
      recent: KeywordPerformanceData[],
      previous: KeywordPerformanceData[],
      metric: keyof KeywordPerformanceData,
    ) => {
      if (recent.length === 0 || previous.length === 0) return 0
      const recentAvg = recent.reduce((sum, item) => sum + Number(item[metric]), 0) / recent.length
      const previousAvg = previous.reduce((sum, item) => sum + Number(item[metric]), 0) / previous.length
      return previousAvg === 0 ? 0 : Number((((recentAvg - previousAvg) / previousAvg) * 100).toFixed(1))
    }

    const trends = {
      impressions: calculateTrend(recent, previous, "impressions"),
      clicks: calculateTrend(recent, previous, "clicks"),
      ctr: calculateTrend(recent, previous, "ctr"),
      conversions: calculateTrend(recent, previous, "conversions"),
      ranking: -calculateTrend(recent, previous, "ranking"), // Negative because lower ranking is better
    }

    const achievements = {
      targetRankingReached:
        (implementation.currentRanking || implementation.targetRanking) <= implementation.targetRanking,
      estimatedImpactAchieved: trends.impressions >= implementation.estimatedImpact * 0.8,
      roiPositive: currentMetrics.roas > 1,
      performanceImproving: trends.impressions > 0 && trends.clicks > 0,
    }

    return {
      implementation,
      performanceHistory,
      currentMetrics,
      trends,
      achievements,
    }
  })
}

export function KeywordPerformanceTracker({ products }: KeywordPerformanceTrackerProps) {
  const [trackingData, setTrackingData] = useState<KeywordTracking[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string>("")
  const [timeRange, setTimeRange] = useState<string>("30")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")

  useEffect(() => {
    const implementations = generateImplementedKeywords()
    const tracking = generateKeywordTracking(implementations)
    setTrackingData(tracking)
    if (tracking.length > 0) {
      setSelectedKeyword(tracking[0].implementation.id)
    }
  }, [])

  const selectedTracking = trackingData.find((t) => t.implementation.id === selectedKeyword)

  // Filter tracking data
  const filteredTracking = trackingData.filter((tracking) => {
    if (statusFilter !== "all" && tracking.implementation.status !== statusFilter) return false
    if (performanceFilter === "improving" && tracking.trends.impressions <= 0) return false
    if (performanceFilter === "declining" && tracking.trends.impressions >= 0) return false
    if (performanceFilter === "target_reached" && !tracking.achievements.targetRankingReached) return false
    return true
  })

  // Calculate summary metrics
  const totalKeywords = trackingData.length
  const activeKeywords = trackingData.filter((t) => t.implementation.status === "active").length
  const targetReached = trackingData.filter((t) => t.achievements.targetRankingReached).length
  const avgImprovement =
    trackingData.reduce((sum, t) => sum + t.trends.impressions, 0) / Math.max(trackingData.length, 1)

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Target className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-gray-400"
  }

  const getStatusBadge = (status: KeywordImplementation["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "removed":
        return <Badge variant="outline">Removed</Badge>
    }
  }

  const getSuggestionTypeBadge = (type: KeywordImplementation["suggestionType"]) => {
    const colors = {
      missing_keyword: "bg-red-100 text-red-800",
      trending_term: "bg-green-100 text-green-800",
      competitor_term: "bg-blue-100 text-blue-800",
      long_tail: "bg-purple-100 text-purple-800",
      seasonal: "bg-orange-100 text-orange-800",
      brand_variant: "bg-gray-100 text-gray-800",
    }

    return <Badge className={colors[type]}>{type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Badge>
  }

  // Prepare chart data
  const chartData = selectedTracking?.performanceHistory.slice(-Number.parseInt(timeRange)) || []

  // Performance distribution data
  const performanceDistribution = [
    { name: "Target Reached", value: targetReached, color: "#10b981" },
    { name: "In Progress", value: activeKeywords - targetReached, color: "#f59e0b" },
    { name: "Paused/Removed", value: totalKeywords - activeKeywords, color: "#6b7280" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Keyword Performance Tracker</h2>
            <p className="text-muted-foreground">Monitor the effectiveness of implemented AI keyword suggestions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords}</div>
            <p className="text-xs text-muted-foreground">{activeKeywords} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Reached</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetReached}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((targetReached / Math.max(totalKeywords, 1)) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{avgImprovement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">impressions growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Positive</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackingData.filter((t) => t.achievements.roiPositive).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (trackingData.filter((t) => t.achievements.roiPositive).length / Math.max(totalKeywords, 1)) * 100,
              )}
              % profitable
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Performance Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Current status of implemented keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {performanceDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Keywords</CardTitle>
                <CardDescription>Keywords with highest improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trackingData
                    .sort((a, b) => b.trends.impressions - a.trends.impressions)
                    .slice(0, 5)
                    .map((tracking) => (
                      <div key={tracking.implementation.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">"{tracking.implementation.keyword}"</div>
                          <div className="text-xs text-muted-foreground">{tracking.implementation.productName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(tracking.trends.impressions)}
                          <span className={`text-sm font-medium ${getTrendColor(tracking.trends.impressions)}`}>
                            {tracking.trends.impressions > 0 ? "+" : ""}
                            {tracking.trends.impressions}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Implemented Keywords</CardTitle>
              <CardDescription>Performance overview of all tracked keywords</CardDescription>
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="removed">Removed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Performance</Label>
                  <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="improving">Improving</SelectItem>
                      <SelectItem value="declining">Declining</SelectItem>
                      <SelectItem value="target_reached">Target Reached</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTracking.map((tracking) => (
                    <TableRow key={tracking.implementation.id}>
                      <TableCell>
                        <div className="font-medium">"{tracking.implementation.keyword}"</div>
                        <div className="text-xs text-muted-foreground">
                          Implemented: {new Date(tracking.implementation.implementedDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{tracking.implementation.productName}</div>
                      </TableCell>
                      <TableCell>{getSuggestionTypeBadge(tracking.implementation.suggestionType)}</TableCell>
                      <TableCell>{getStatusBadge(tracking.implementation.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">#{tracking.currentMetrics.ranking}</span>
                          {tracking.achievements.targetRankingReached && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: #{tracking.implementation.targetRanking}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{tracking.currentMetrics.impressions.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{tracking.currentMetrics.ctr.toFixed(2)}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{tracking.currentMetrics.conversions}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-medium ${tracking.currentMetrics.roas > 1 ? "text-green-600" : "text-red-600"}`}
                        >
                          {tracking.currentMetrics.roas.toFixed(2)}x
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(tracking.trends.impressions)}
                          <span className={`text-sm font-medium ${getTrendColor(tracking.trends.impressions)}`}>
                            {tracking.trends.impressions > 0 ? "+" : ""}
                            {tracking.trends.impressions}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {/* Keyword Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Keyword for Detailed Analysis</CardTitle>
              <CardDescription>Choose a keyword to see detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a keyword" />
                </SelectTrigger>
                <SelectContent>
                  {trackingData.map((tracking) => (
                    <SelectItem key={tracking.implementation.id} value={tracking.implementation.id}>
                      <div className="flex items-center space-x-2">
                        <span>"{tracking.implementation.keyword}"</span>
                        <Badge variant="outline" className="text-xs">
                          {tracking.implementation.productName}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedTracking && (
            <>
              {/* Keyword Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Details</CardTitle>
                  <CardDescription>"{selectedTracking.implementation.keyword}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Product</Label>
                        <div className="text-lg">{selectedTracking.implementation.productName}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Implementation Date</Label>
                        <div className="text-lg">
                          {new Date(selectedTracking.implementation.implementedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Suggestion Type</Label>
                        <div className="mt-1">
                          {getSuggestionTypeBadge(selectedTracking.implementation.suggestionType)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedTracking.implementation.status)}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Current Ranking</Label>
                        <div className="text-lg font-bold">#{selectedTracking.currentMetrics.ranking}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: #{selectedTracking.implementation.targetRanking}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Estimated Impact</Label>
                        <div className="text-lg">+{selectedTracking.implementation.estimatedImpact}%</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Confidence Score</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={selectedTracking.implementation.confidence} className="w-24 h-2" />
                          <span className="text-sm">{selectedTracking.implementation.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Achievements</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedTracking.achievements.targetRankingReached && (
                            <Badge className="bg-green-100 text-green-800">Target Reached</Badge>
                          )}
                          {selectedTracking.achievements.roiPositive && (
                            <Badge className="bg-blue-100 text-blue-800">ROI Positive</Badge>
                          )}
                          {selectedTracking.achievements.performanceImproving && (
                            <Badge className="bg-purple-100 text-purple-800">Improving</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Metrics */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedTracking.currentMetrics.impressions.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(selectedTracking.trends.impressions)}
                      <span className={getTrendColor(selectedTracking.trends.impressions)}>
                        {selectedTracking.trends.impressions > 0 ? "+" : ""}
                        {selectedTracking.trends.impressions}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTracking.currentMetrics.clicks.toLocaleString()}</div>
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(selectedTracking.trends.clicks)}
                      <span className={getTrendColor(selectedTracking.trends.clicks)}>
                        {selectedTracking.trends.clicks > 0 ? "+" : ""}
                        {selectedTracking.trends.clicks}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CTR</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTracking.currentMetrics.ctr.toFixed(2)}%</div>
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(selectedTracking.trends.ctr)}
                      <span className={getTrendColor(selectedTracking.trends.ctr)}>
                        {selectedTracking.trends.ctr > 0 ? "+" : ""}
                        {selectedTracking.trends.ctr}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTracking.currentMetrics.conversions}</div>
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(selectedTracking.trends.conversions)}
                      <span className={getTrendColor(selectedTracking.trends.conversions)}>
                        {selectedTracking.trends.conversions > 0 ? "+" : ""}
                        {selectedTracking.trends.conversions}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Time Range Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical performance data for selected keyword</CardDescription>
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <Label>Keyword</Label>
                  <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a keyword" />
                    </SelectTrigger>
                    <SelectContent>
                      {trackingData.map((tracking) => (
                        <SelectItem key={tracking.implementation.id} value={tracking.implementation.id}>
                          "{tracking.implementation.keyword}"
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {selectedTracking && (
            <>
              {/* Performance Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Impressions & Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <Area
                          type="monotone"
                          dataKey="impressions"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>CTR & Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <Line type="monotone" dataKey="ctr" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="conversionRate" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ranking Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis reversed domain={["dataMin", "dataMax"]} />
                        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <Line type="monotone" dataKey="ranking" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & ROAS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <Bar dataKey="revenue" fill="#10b981" />
                        <Line type="monotone" dataKey="roas" stroke="#f59e0b" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
