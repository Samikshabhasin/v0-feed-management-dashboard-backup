"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  AlertTriangle,
  Eye,
  MousePointer,
  Package,
  Target,
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Clock,
  Star,
} from "lucide-react"

interface OpportunitySignal {
  id: string
  title: string
  description: string
  value: number
  unit: string
  impact: "high" | "medium" | "low"
  urgency: "critical" | "high" | "medium" | "low"
  category: "visibility" | "performance" | "revenue" | "quality"
  icon: any
  color: string
  bgColor: string
  actionText: string
  estimatedRevenue?: number
  estimatedTime?: string
}

const opportunitySignals: OpportunitySignal[] = [
  {
    id: "missing_impressions",
    title: "Products Missing Impressions",
    description: "High-value products with zero impressions in the last 30 days",
    value: 68,
    unit: "products",
    impact: "high",
    urgency: "critical",
    category: "visibility",
    icon: Eye,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    actionText: "Fix Visibility Issues",
    estimatedRevenue: 15000,
    estimatedTime: "2-3 days",
  },
  {
    id: "low_coverage_categories",
    title: "Categories with Low Coverage",
    description: "Product categories with less than 50% feed coverage",
    value: 12,
    unit: "categories",
    impact: "high",
    urgency: "high",
    category: "visibility",
    icon: BarChart3,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    actionText: "Expand Coverage",
    estimatedRevenue: 8500,
    estimatedTime: "1-2 weeks",
  },
  {
    id: "zero_clicks_new",
    title: "New Products with Zero Clicks",
    description: "Recently added products not receiving any clicks",
    value: 45,
    unit: "products",
    impact: "medium",
    urgency: "high",
    category: "performance",
    icon: MousePointer,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
    actionText: "Optimize Titles",
    estimatedRevenue: 5200,
    estimatedTime: "3-5 days",
  },
  {
    id: "high_ctr_missing",
    title: "High-CTR Products Missing",
    description: "Products with >5% CTR not in current feed optimization",
    value: 23,
    unit: "products",
    impact: "high",
    urgency: "medium",
    category: "revenue",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    actionText: "Add to Feed",
    estimatedRevenue: 12000,
    estimatedTime: "1 day",
  },
  {
    id: "price_competitive_gap",
    title: "Price Competitiveness Gap",
    description: "Products priced 20%+ above market average",
    value: 34,
    unit: "products",
    impact: "high",
    urgency: "medium",
    category: "revenue",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    actionText: "Review Pricing",
    estimatedRevenue: 9800,
    estimatedTime: "2-3 days",
  },
  {
    id: "quality_score_drop",
    title: "Quality Score Decline",
    description: "Products with 20%+ quality score drop this month",
    value: 19,
    unit: "products",
    impact: "medium",
    urgency: "high",
    category: "quality",
    icon: Star,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    actionText: "Improve Quality",
    estimatedRevenue: 4500,
    estimatedTime: "1 week",
  },
  {
    id: "seasonal_opportunity",
    title: "Seasonal Opportunity",
    description: "Products trending up but missing seasonal keywords",
    value: 28,
    unit: "products",
    impact: "medium",
    urgency: "critical",
    category: "performance",
    icon: Clock,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    actionText: "Add Keywords",
    estimatedRevenue: 6700,
    estimatedTime: "1-2 days",
  },
  {
    id: "competitor_advantage",
    title: "Competitor Advantage Gap",
    description: "Products where competitors have 50%+ higher visibility",
    value: 41,
    unit: "products",
    impact: "high",
    urgency: "medium",
    category: "visibility",
    icon: Target,
    color: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-200",
    actionText: "Competitive Analysis",
    estimatedRevenue: 11200,
    estimatedTime: "1 week",
  },
  {
    id: "1",
    title: "High Search Volume, Low Visibility",
    description: "147 products have high search demand but low ad visibility",
    value: 147,
    unit: "products",
    impact: "high",
    urgency: "critical",
    category: "visibility",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    actionText: "Fix Visibility Issues",
    estimatedRevenue: 45000,
    estimatedTime: "2-3 days",
  },
  {
    id: "2",
    title: "Missing Product Attributes",
    description: "89 products missing critical GTIN or brand information",
    value: 89,
    unit: "products",
    impact: "medium",
    urgency: "high",
    category: "visibility",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    actionText: "Expand Coverage",
    estimatedRevenue: 23000,
    estimatedTime: "1-2 weeks",
  },
  {
    id: "3",
    title: "Price Optimization Opportunity",
    description: "32 products priced above market average",
    value: 32,
    unit: "products",
    impact: "high",
    urgency: "medium",
    category: "revenue",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    actionText: "Review Pricing",
    estimatedRevenue: 67000,
    estimatedTime: "3-5 days",
  },
  {
    id: "4",
    title: "Seasonal Trend Mismatch",
    description: "25 products not optimized for current season",
    value: 25,
    unit: "products",
    impact: "medium",
    urgency: "critical",
    category: "performance",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    actionText: "Add Keywords",
    estimatedRevenue: 18000,
    estimatedTime: "1-2 days",
  },
]

export function OpportunitySignals() {
  const totalEstimatedRevenue = opportunitySignals.reduce((sum, signal) => sum + (signal.estimatedRevenue || 0), 0)
  const criticalSignals = opportunitySignals.filter((s) => s.urgency === "critical")
  const highImpactSignals = opportunitySignals.filter((s) => s.impact === "high")

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">High</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <Zap className="h-3 w-3 text-yellow-500" />
      case "medium":
        return <TrendingUp className="h-3 w-3 text-blue-500" />
      case "low":
        return <Target className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Opportunity Signals</CardTitle>
              <CardDescription>AI-powered insights to maximize your product performance</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">£{totalEstimatedRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">potential revenue</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-900">{criticalSignals.length}</div>
              <div className="text-sm text-red-700">Critical Issues</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-900">{highImpactSignals.length}</div>
              <div className="text-sm text-yellow-700">High Impact</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Package className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">
                {opportunitySignals.reduce((sum, s) => sum + s.value, 0)}
              </div>
              <div className="text-sm text-green-700">Products Affected</div>
            </div>
          </div>
        </div>

        {/* Opportunity Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {opportunitySignals.slice(0, 6).map((signal) => {
            const Icon = signal.icon
            return (
              <Card key={signal.id} className={`${signal.bgColor} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon className={`h-5 w-5 ${signal.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{signal.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getUrgencyBadge(signal.urgency)}
                          <div className="flex items-center space-x-1">
                            {getImpactIcon(signal.impact)}
                            <span className="text-xs text-muted-foreground capitalize">{signal.impact} impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${signal.color}`}>{signal.value}</div>
                      <div className="text-xs text-muted-foreground">{signal.unit}</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{signal.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {signal.estimatedRevenue && (
                        <div className="text-sm font-medium text-green-600">
                          +£{signal.estimatedRevenue.toLocaleString()} potential
                        </div>
                      )}
                      {signal.estimatedTime && (
                        <div className="text-xs text-muted-foreground">Est. time: {signal.estimatedTime}</div>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      {signal.actionText}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Show More Button */}
        {opportunitySignals.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All {opportunitySignals.length} Opportunities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Ready to optimize?</h4>
              <p className="text-sm text-blue-700">
                Address {criticalSignals.length} critical issues first for maximum impact
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                Create Segment
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Zap className="h-4 w-4 mr-2" />
                Auto-Fix Critical
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
