"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceDot,
  ReferenceLine, // Import ReferenceLine
} from "recharts"
import { ChevronDown, ChevronUp, BarChart3, Calendar, Search, Plus, X, Check, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils" // Assuming cn utility is available

interface ProductTrendGraphProps {
  products: Product[]
  dateRange: string
  insightConfig?: {
    channel: string
    metrics: string[]
  } | null
  onInsightAction?: (actionType: string) => void
  visibilityIndexMode?: boolean // Add visibilityIndexMode prop
}

interface TrendDataPoint {
  date: string
  // Google Ads / Shopping metrics
  visibilityScore: number
  impressions: number
  clicks: number
  avgCpc: number
  conversionRate: number
  conversions: number
  revenue: number
  roas: number
  ctr: number

  // Product quality metrics
  returnRate: number
  bounceRate: number

  // Inventory & pricing
  inventoryLevel: number
  avgPrice: number
  shippingCost: number

  // Search Intelligence (Algolia) metrics
  searchImpressions: number
  searchClicks: number
  searchCtr: number
  searchAddToCarts: number
  searchPurchases: number
  searchConversionRate: number
}

interface MetricConfig {
  key: keyof TrendDataPoint
  label: string
  color: string
  yAxisId: string
  format: (value: number) => string
}

interface SpikeAnnotation {
  date: string
  metricKey: string
  value: number
  changePercent: number
  message: string
  cause: string
  nextStep: string
  isSpike: boolean // true for spike, false for dip
  trendDirection: "improving" | "worsening" | "flat"
  trendPercent: number
  firstDetected: string
}

interface AIInsight {
  metric: string
  changePercent: number
  cause: string
  action: string
  trend?: string // Changed from trend to trend? to be optional
  firstDetected?: string // Changed from firstDetected to firstDetected? to be optional
  targetChannel?: string
  targetMetrics?: string[]
  actionType?: string
}

const channelTypes = {
  "paid-search": {
    label: "Paid Search",
    partners: ["google", "microsoft"],
  },
  social: {
    label: "Social",
    partners: ["meta", "tiktok", "pinterest"],
  },
  affiliate: {
    label: "Affiliate",
    partners: ["awin", "rakuten"],
  },
  marketplace: {
    label: "Marketplace",
    partners: ["amazon", "<bos>ebay"],
  },
  "ai-commerce": {
    label: "AI Commerce",
    partners: ["agentic", "perplexity"],
  },
}

const metrics: MetricConfig[] = [
  // Google Ads / Shopping Performance
  {
    key: "visibilityScore",
    label: "Visibility Score (%)",
    color: "#8b5cf6",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(1)}%`,
  },
  {
    key: "impressions",
    label: "Impressions",
    color: "#3b82f6",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "clicks",
    label: "Clicks",
    color: "#06b6d4",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "avgCpc",
    label: "Avg CPC (£)",
    color: "#ef4444",
    yAxisId: "currency",
    format: (value) => `£${value.toFixed(2)}`,
  },
  {
    key: "ctr",
    label: "Click-Through Rate (%)",
    color: "#8b5cf6",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(2)}%`,
  },
  {
    key: "conversionRate",
    label: "Conversion Rate (%)",
    color: "#10b981",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(1)}%`,
  },
  {
    key: "conversions",
    label: "Conversions",
    color: "#059669",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "revenue",
    label: "Revenue (£)",
    color: "#f59e0b",
    yAxisId: "currency",
    format: (value) => `£${(value / 1000).toFixed(1)}k`,
  },
  {
    key: "roas",
    label: "ROAS",
    color: "#d97706",
    yAxisId: "ratio",
    format: (value) => `${value.toFixed(1)}x`,
  },

  // Product Quality Metrics
  {
    key: "returnRate",
    label: "Return Rate (%)",
    color: "#dc2626",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(1)}%`,
  },
  {
    key: "bounceRate",
    label: "Bounce Rate (%)",
    color: "#b91c1c",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(1)}%`,
  },

  // Inventory & Pricing
  {
    key: "inventoryLevel",
    label: "Inventory Level",
    color: "#7c3aed",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "avgPrice",
    label: "Avg Price (£)",
    color: "#c026d3",
    yAxisId: "currency",
    format: (value) => `£${value.toFixed(0)}`,
  },
  {
    key: "shippingCost",
    label: "Shipping Cost (£)",
    color: "#be185d",
    yAxisId: "currency",
    format: (value) => `£${value.toFixed(2)}`,
  },

  // Search Intelligence (Algolia)
  {
    key: "searchImpressions",
    label: "Search Impressions",
    color: "#0891b2",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "searchClicks",
    label: "Search Clicks",
    color: "#0e7490",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "searchCtr",
    label: "Search CTR (%)",
    color: "#155e75",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(2)}%`,
  },
  {
    key: "searchAddToCarts",
    label: "Search Add to Carts",
    color: "#166534",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "searchPurchases",
    label: "Search Purchases",
    color: "#15803d",
    yAxisId: "volume",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "searchConversionRate",
    label: "Search Conversion Rate (%)",
    color: "#16a34a",
    yAxisId: "percentage",
    format: (value) => `${value.toFixed(1)}%`,
  },
]

const AnnotationTooltip = ({ annotation, metrics }: { annotation: SpikeAnnotation; metrics: MetricConfig[] }) => {
  const metric = metrics.find((m) => m.key === annotation.metricKey)
  if (!metric) return null

  const channelMatch = annotation.message.match(/(Google|Meta|TikTok|Pinterest)\s*$$[+-]?\d+%$$/)
  const channelInfo = channelMatch ? channelMatch[0] : null

  return (
    <div
      className="bg-white/95 border border-gray-200 rounded-lg shadow-lg max-w-[250px] animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        padding: "10px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-900 text-sm">AI Insight metric -</span>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: metric.color }} />
          <span className="text-sm font-semibold text-gray-900">{metric.label}</span>
        </div>
      </div>
      <div className="space-y-2">
        {channelInfo && (
          <div>
            <div className="text-xs font-medium text-gray-500 mb-0.5">Primary Driver</div>
            <Badge className="bg-blue-100 text-blue-900 border-blue-200 font-semibold text-xs">{channelInfo}</Badge>
          </div>
        )}

        <div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">Change</div>
          <div className={`text-sm font-bold ${annotation.isSpike ? "text-green-600" : "text-red-600"}`}>
            {annotation.isSpike ? "+" : ""}
            {annotation.changePercent.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">Probable cause</div>
          <div className="text-[13px] text-gray-700 leading-snug">{annotation.cause}</div>
        </div>
      </div>
    </div>
  )
}

const CustomAnnotationDot = (props: any) => {
  const { cx, cy, annotation, metrics, width, height, onHoverStart, onHoverEnd, hoveredAnnotation, onClick } = props
  const [isHovered, setIsHovered] = useState(false)

  const chartWidth = width || 800
  const chartHeight = height || 320
  const tooltipWidth = 250
  const tooltipHeight = 180
  const padding = 15

  // Intelligent positioning: check all boundaries
  let tooltipX = cx + padding
  let tooltipY = cy - tooltipHeight / 2

  // Check right boundary - flip to left if too close to edge
  if (tooltipX + tooltipWidth > chartWidth - padding) {
    tooltipX = cx - tooltipWidth - padding
  }

  // Check left boundary - ensure minimum padding
  if (tooltipX < padding) {
    tooltipX = padding
  }

  // Check top boundary
  if (tooltipY < padding) {
    tooltipY = padding
  }

  // Check bottom boundary
  if (tooltipY + tooltipHeight > chartHeight - padding) {
    tooltipY = chartHeight - tooltipHeight - padding
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (onHoverStart) onHoverStart()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // FIX: onEnd was misspelled, it should be onHoverEnd.
    if (onHoverEnd) onHoverEnd()
  }

  const handleClick = () => {
    if (onClick) onClick(annotation)
  }

  const annotationKey = `${annotation.date}-${annotation.metricKey}`
  // FIX: hoveredAnnotation was compared to itself. It should be compared to annotationKey.
  const shouldHide = hoveredAnnotation && hoveredAnnotation !== annotationKey

  if (shouldHide) {
    return null
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={annotation.isSpike ? "#10b981" : "#ef4444"}
        stroke="white"
        strokeWidth={2}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
        className="hover:r-7"
      />
      <Zap
        x={cx - 4}
        y={cy - 4}
        width={8}
        height={8}
        fill="white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
      {isHovered && (
        <foreignObject
          x={tooltipX}
          y={tooltipY}
          width={tooltipWidth}
          height={tooltipHeight}
          style={{
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <AnnotationTooltip annotation={annotation} metrics={metrics} />
        </foreignObject>
      )}
    </g>
  )
}

// </CHANGE> Re-assign useState to use a more descriptive name for clarity
export default function ProductTrendGraph({
  products,
  dateRange,
  insightConfig,
  onInsightAction,
  visibilityIndexMode = false, // Initialize visibilityIndexMode
}: ProductTrendGraphProps) {
  const [selectedChannelType, setSelectedChannelType] = useState<string>("all")
  const [selectedChannel, setSelectedChannel] = useState<string>("all")
  const [compareChannel, setCompareChannel] = useState<string | null>(null)
  const [showCompareDropdown, setShowCompareDropdown] = useState(false)

  const [showAIInsights, setShowAIInsights] = useState(true)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)
  const [clickedAnnotation, setClickedAnnotation] = useState<SpikeAnnotation | null>(null)
  const [clickedInsight, setClickedInsight] = useState<AIInsight | null>(null)

  // Default to showing only Visibility Score and Impressions
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["visibilityScore", "impressions"])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [chartDateRange, setChartDateRange] = useState(dateRange)
  const [metricSearchQuery, setMetricSearchQuery] = useState("")

  const [previousPeriodData, setPreviousPeriodData] = useState<any[]>([])
  const [channelBreakdownData, setChannelBreakdownData] = useState<Record<string, any[]>>({})

  const getChannelName = (channel: string) => {
    const channelNames: Record<string, string> = {
      all: "All Channels",
      google: "Google",
      meta: "Meta",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      agentic: "Agentic Commerce (ChatGPT)",
      microsoft: "Microsoft",
      awin: "Awin",
      rakuten: "Rakuten",
      amazon: "Amazon",
      ebay: "eBay",
      perplexity: "Perplexity",
    }
    return channelNames[channel] || channel
  }

  // Update chart date range when dashboard date range changes
  useEffect(() => {
    setChartDateRange(dateRange)
  }, [dateRange])

  useEffect(() => {
    if (insightConfig) {
      console.log("[v0] Insight config received:", insightConfig)
      console.log("[v0] Setting channel to:", insightConfig.channel)
      console.log("[v0] Setting metrics to:", insightConfig.metrics)

      setSelectedChannel(insightConfig.channel)
      setSelectedMetrics(insightConfig.metrics)
      setCompareChannel(null) // Clear comparison

      // Scroll to graph
      setTimeout(() => {
        const chartElement = document.querySelector("[data-chart]")
        if (chartElement) {
          chartElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 200)
    }
  }, [insightConfig])

  // Filter metrics based on search query
  const filteredMetrics = useMemo(() => {
    if (!metricSearchQuery) return metrics
    return metrics.filter((metric) => metric.label.toLowerCase().includes(metricSearchQuery.toLowerCase()))
  }, [metricSearchQuery])

  useEffect(() => {
    if (trendData.length > 0) {
      setPreviousPeriodData(trendData)
    }
  }, [chartDateRange, selectedChannel, compareChannel])

  const availablePartners = useMemo(() => {
    if (selectedChannelType === "all") {
      return [
        "google",
        "microsoft",
        "meta",
        "tiktok",
        "pinterest",
        "awin",
        "rakuten",
        "amazon",
        "ebay",
        "agentic",
        "perplexity",
      ]
    }
    return channelTypes[selectedChannelType as keyof typeof channelTypes]?.partners || []
  }, [selectedChannelType])

  useEffect(() => {
    if (selectedChannelType !== "all" && !availablePartners.includes(selectedChannel)) {
      setSelectedChannel(availablePartners[0] || "all")
    }
  }, [selectedChannelType, availablePartners, selectedChannel])

  useEffect(() => {
    if (clickedInsight && clickedInsight.targetChannel && clickedInsight.targetMetrics) {
      console.log("[v0] Insight clicked:", clickedInsight)

      // Update the selected channel
      setSelectedChannel(clickedInsight.targetChannel)

      // Update the selected metrics
      setSelectedMetrics(clickedInsight.targetMetrics)

      // Clear compare channel to show single channel view
      setCompareChannel(null)

      // Scroll to the graph
      setTimeout(() => {
        const graphElement = document.querySelector(".recharts-wrapper")
        if (graphElement) {
          graphElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }
  }, [clickedInsight])

  const trendData = useMemo(() => {
    const trendDataPoints: TrendDataPoint[] = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(chartDateRange, 10) + 1)

    // Special case: When Google impressions insight is triggered, show gradual decline after Oct 19
    if (
      insightConfig &&
      insightConfig.channel === "google" &&
      selectedChannel === "google" &&
      insightConfig.metrics.includes("impressions") &&
      selectedMetrics.includes("impressions")
    ) {
      const data: Partial<TrendDataPoint>[] = [] // Use Partial to allow partial assignment
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        // Use "en-US" for consistency with potential future date parsing, but display as "MMM D"
        const dateStr = date.toLocaleDateString("en-US", { day: "numeric", month: "short" })

        let impressions: number
        let clicks: number
        let visibility: number

        if (i < 19) {
          // Days 1-19: Normal fluctuation around 9000-9500
          impressions = 9000 + Math.random() * 500 + i * 10
          clicks = impressions * (0.02 + Math.random() * 0.01)
          visibility = 75 + Math.random() * 10
        } else if (i === 19) {
          // Day 20 (Oct 19): Start of gradual decline
          impressions = 7700 + Math.random() * 100
          clicks = impressions * (0.018 + Math.random() * 0.008)
          visibility = 68 + Math.random() * 5
        } else {
          // Days 21-30: Continued decline, no recovery
          const daysAfterDecline = i - 19
          impressions = 7700 - daysAfterDecline * 35 + Math.random() * 80
          clicks = impressions * (0.017 + Math.random() * 0.007)
          visibility = 65 - daysAfterDecline * 0.5 + Math.random() * 3
        }

        data.push({
          date: dateStr,
          impressions: Math.round(impressions),
          clicks: Math.round(clicks),
          visibilityScore: Math.round(visibility * 10) / 10,
          // Fill in other metrics with defaults or reasonable fallbacks
          avgCpc: 0.9,
          conversionRate: 3.5,
          conversions: Math.round(clicks * 0.035),
          revenue: Math.round(clicks * 0.035 * 50), // Assuming avg order value of £50
          roas: 2.5,
          ctr: (clicks / impressions) * 100,
          returnRate: 5,
          bounceRate: 45,
          inventoryLevel: 1000,
          avgPrice: 60,
          shippingCost: 4.5,
          searchImpressions: Math.round(impressions * 0.7),
          searchClicks: Math.round(clicks * 0.5),
          searchCtr: 5,
          searchAddToCarts: Math.round(clicks * 0.1),
          searchPurchases: Math.round(clicks * 0.03),
          searchConversionRate: 3,
        })
      }
      return data as TrendDataPoint[] // Cast to TrendDataPoint[]
    } else {
      // Original data generation logic
      const days = Number.parseInt(chartDateRange, 10) // Use chartDateRange
      const data: any[] = []

      const generateNarrativeData = (channel: string, suffix = "") => {
        const narrativeData: any[] = []

        const baselineValues: Record<string, any> = {
          google: {
            visibilityScore: 72,
            impressions: 8500,
            clicks: 680,
            avgCpc: 0.95,
            revenue: 850000,
            roas: 18.5,
          },
          meta: {
            visibilityScore: 68,
            impressions: 7200,
            clicks: 590,
            avgCpc: 1.15,
            revenue: 720000,
            roas: 16.2,
          },
          tiktok: {
            visibilityScore: 65,
            impressions: 6800,
            clicks: 550,
            avgCpc: 0.75,
            revenue: 680000,
            roas: 19.8,
          },
          agentic: {
            visibilityScore: 70,
            impressions: 5200,
            clicks: 480,
            avgCpc: 0.65,
            revenue: 620000,
            roas: 22.5,
          },
          microsoft: {
            visibilityScore: 69,
            impressions: 6200,
            clicks: 510,
            avgCpc: 0.88,
            revenue: 650000,
            roas: 17.8,
          },
          pinterest: {
            visibilityScore: 64,
            impressions: 5800,
            clicks: 470,
            avgCpc: 0.92,
            revenue: 580000,
            roas: 15.5,
          },
          awin: {
            visibilityScore: 66,
            impressions: 4500,
            clicks: 380,
            avgCpc: 0.55,
            revenue: 480000,
            roas: 21.2,
          },
          rakuten: {
            visibilityScore: 65,
            impressions: 4200,
            clicks: 350,
            avgCpc: 0.58,
            revenue: 450000,
            roas: 20.5,
          },
          amazon: {
            visibilityScore: 75,
            impressions: 12000,
            clicks: 980,
            avgCpc: 0.42,
            revenue: 1200000,
            roas: 24.8,
          },
          ebay: {
            visibilityScore: 71,
            impressions: 9500,
            clicks: 780,
            avgCpc: 0.38,
            revenue: 950000,
            roas: 23.2,
          },
          perplexity: {
            visibilityScore: 68,
            impressions: 3800,
            clicks: 340,
            avgCpc: 0.72,
            revenue: 420000,
            roas: 19.5,
          },
          all: {
            visibilityScore: 68,
            impressions: 7500,
            clicks: 600,
            avgCpc: 0.95,
            revenue: 750000,
            roas: 18.0,
          },
        }

        const baseline = baselineValues[channel] || baselineValues.all

        for (let i = 0; i < days; i++) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          const dateStr = date.toLocaleDateString("en-GB", { month: "short", day: "numeric" })

          const dayOfWeek = date.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const weekendFactor = isWeekend ? 0.85 : 1.0
          // Natural daily fluctuation (±3-5%)
          const dailyNoise = 1 + (Math.random() - 0.5) * 0.08

          let visibilityScore = baseline.visibilityScore
          let impressions = baseline.impressions
          let avgCpc = baseline.avgCpc
          let revenue = baseline.revenue
          let roas = baseline.roas

          // Week 1 (Days 0-6): Stable baseline
          if (i <= 6) {
            visibilityScore *= 1.0 * dailyNoise
            impressions *= 1.0 * weekendFactor * dailyNoise
            avgCpc *= 1.0 * dailyNoise
            revenue *= 1.0 * weekendFactor * dailyNoise
            roas *= 1.0 * dailyNoise
          }

          // Week 2 (Days 7-13): Meta ad efficiency improves
          else if (i <= 13) {
            if (channel === "meta" || channel === "all") {
              const metaBoost = 1 + ((i - 7) / 7) * 0.12 // Gradual +12% ROAS improvement
              const cpcReduction = 1 - ((i - 7) / 7) * 0.08 // Gradual -8% CPC reduction

              visibilityScore *= 1.02 * dailyNoise
              impressions *= 1.05 * weekendFactor * dailyNoise
              avgCpc *= cpcReduction * dailyNoise
              revenue *= 1.08 * weekendFactor * dailyNoise
              roas *= metaBoost * dailyNoise
            } else {
              visibilityScore *= 1.0 * dailyNoise
              impressions *= 1.0 * weekendFactor * dailyNoise
              avgCpc *= 1.0 * dailyNoise
              revenue *= 1.0 * weekendFactor * dailyNoise
              roas *= 1.0 * dailyNoise
            }
          }

          // Week 3 (Days 14-20): Google visibility drop from feed disapprovals
          else if (i <= 20) {
            if (channel === "google" || channel === "all") {
              const visibilityDrop = 1 - ((i - 14) / 7) * 0.08 // Gradual -8% visibility drop
              const revenueDrop = 1 - ((i - 14) / 7) * 0.06 // -6% revenue impact

              visibilityScore *= visibilityDrop * dailyNoise
              impressions *= 0.94 * weekendFactor * dailyNoise
              avgCpc *= 1.03 * dailyNoise // Slight CPC increase due to lower quality score
              revenue *= revenueDrop * weekendFactor * dailyNoise
              roas *= 0.95 * dailyNoise
            } else if (channel === "meta") {
              // Meta continues strong performance
              visibilityScore *= 1.02 * dailyNoise
              impressions *= 1.06 * weekendFactor * dailyNoise
              avgCpc *= 0.92 * dailyNoise
              revenue *= 1.1 * weekendFactor * dailyNoise
              roas *= 1.12 * dailyNoise
            } else {
              visibilityScore *= 1.0 * dailyNoise
              impressions *= 1.0 * weekendFactor * dailyNoise
              avgCpc *= 1.0 * dailyNoise
              revenue *= 1.0 * weekendFactor * dailyNoise
              roas *= 1.0 * dailyNoise
            }
          }

          // Week 4 (Days 21-29): TikTok campaign surge
          else {
            if (channel === "tiktok" || channel === "all") {
              const impressionSurge = 1 + ((i - 21) / 9) * 0.25 // Gradual +25% impression surge
              const roasImprovement = 1 + ((i - 21) / 9) * 0.15 // +15% ROAS improvement

              visibilityScore *= 1.08 * dailyNoise
              impressions *= impressionSurge * weekendFactor * dailyNoise
              avgCpc *= 0.85 * dailyNoise // Low CPC
              revenue *= 1.18 * weekendFactor * dailyNoise
              roas *= roasImprovement * dailyNoise
            } else if (channel === "google") {
              // Google starts recovering
              visibilityScore *= 0.94 * dailyNoise
              impressions *= 0.96 * weekendFactor * dailyNoise
              avgCpc *= 1.02 * dailyNoise
              revenue *= 0.96 * weekendFactor * dailyNoise
              roas *= 0.96 * dailyNoise
            } else if (channel === "meta") {
              // Meta maintains strong performance
              visibilityScore *= 1.02 * dailyNoise
              impressions *= 1.08 * weekendFactor * dailyNoise
              avgCpc *= 0.9 * dailyNoise
              revenue *= 1.12 * weekendFactor * dailyNoise
              roas *= 1.14 * dailyNoise
            } else {
              visibilityScore *= 1.0 * dailyNoise
              impressions *= 1.0 * weekendFactor * dailyNoise
              avgCpc *= 1.0 * dailyNoise
              revenue *= 1.0 * weekendFactor * dailyNoise
              roas *= 1.0 * dailyNoise
            }
          }

          // Calculate derived metrics
          const clicks = Math.round(impressions * 0.08) // ~8% CTR
          const conversions = Math.round(clicks * 0.072) // ~7.2% conversion rate
          const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0
          const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

          narrativeData.push({
            date: dateStr,
            [`visibilityScore${suffix}`]: Math.max(50, Math.min(80, visibilityScore)),
            [`impressions${suffix}`]: Math.max(0, Math.round(impressions)),
            [`clicks${suffix}`]: Math.max(0, clicks),
            [`avgCpc${suffix}`]: Math.max(0.4, Math.min(1.5, avgCpc)),
            [`ctr${suffix}`]: ctr,
            [`conversionRate${suffix}`]: conversionRate,
            [`conversions${suffix}`]: conversions,
            [`revenue${suffix}`]: Math.max(500000, Math.min(1200000, revenue)),
            [`roas${suffix}`]: Math.max(10, Math.min(30, roas)),
            [`returnRate${suffix}`]: 8.5 + (Math.random() - 0.5) * 2,
            [`bounceRate${suffix}`]: 42 + (Math.random() - 0.5) * 8,
            [`inventoryLevel${suffix}`]: Math.round(1200 + (Math.random() - 0.5) * 200),
            [`avgPrice${suffix}`]: 89 + (Math.random() - 0.5) * 15,
            [`shippingCost${suffix}`]: 4.5 + (Math.random() - 0.5) * 1.5,
            [`searchImpressions${suffix}`]: Math.round(impressions * 0.6),
            [`searchClicks${suffix}`]: Math.round(clicks * 0.4),
            [`searchCtr${suffix}`]: 6.5 + (Math.random() - 0.5) * 2,
            [`searchAddToCarts${suffix}`]: Math.round(clicks * 0.15),
            [`searchPurchases${suffix}`]: Math.round(conversions * 0.8),
            [`searchConversionRate${suffix}`]: 5.2 + (Math.random() - 0.5) * 1.5,
          })
        }

        return narrativeData
      }

      if (selectedChannel === "all" && !compareChannel) {
        const channels = [
          "google",
          "microsoft",
          "meta",
          "tiktok",
          "pinterest",
          "awin",
          "rakuten",
          "amazon",
          "ebay",
          "agentic",
          "perplexity",
        ]
        const breakdown: Record<string, any[]> = {}

        channels.forEach((channel) => {
          breakdown[channel] = generateNarrativeData(channel, "")
        })

        setChannelBreakdownData(breakdown)
      }

      // Generate data for primary channel
      const primaryData = generateNarrativeData(selectedChannel, "")

      // If comparing, merge with compare channel data
      if (compareChannel) {
        const compareData = generateNarrativeData(compareChannel, "_compare")
        return primaryData.map((d, i) => ({ ...d, ...compareData[i] }))
      }

      return primaryData
    }
  }, [selectedChannel, compareChannel, visibilityIndexMode, selectedMetrics, insightConfig, chartDateRange]) // Add visibilityIndexMode dependency, chartDateRange

  // Calculate insights based on trend data and selected metrics
  const insights = useMemo(() => {
    if (trendData.length < 7) return "Not enough data to generate insights."

    const recent = trendData.slice(-3) // Last 3 days
    const previous = trendData.slice(-7, -3) // Previous 4 days

    const recentAvgVisibility = recent.reduce((sum, d) => sum + d.visibilityScore, 0) / recent.length
    const previousAvgVisibility = previous.reduce((sum, d) => sum + d.visibilityScore, 0) / previous.length
    const visibilityChange = ((recentAvgVisibility - previousAvgVisibility) / previousAvgVisibility) * 100

    const recentAvgImpressions = recent.reduce((sum, d) => sum + d.impressions, 0) / recent.length
    const previousAvgImpressions = previous.reduce((sum, d) => sum + d.impressions, 0) / previous.length
    const impressionsChange = ((recentAvgImpressions - previousAvgImpressions) / previousAvgImpressions) * 100

    const recentAvgCpc = recent.reduce((sum, d) => sum + d.avgCpc, 0) / recent.length
    const previousAvgCpc = previous.reduce((sum, d) => sum + d.avgCpc, 0) / previous.length
    const cpcChange = ((recentAvgCpc - previousAvgCpc) / previousAvgCpc) * 100

    const recentAvgRevenue = recent.reduce((sum, d) => sum + d.revenue, 0) / recent.length
    const previousAvgRevenue = previous.reduce((sum, d) => sum + d.revenue, 0) / previous.length
    const revenueChange = ((recentAvgRevenue - previousAvgRevenue) / previousAvgRevenue) * 100
    const revenueImpact = Math.abs(recentAvgRevenue - previousAvgRevenue) * 3 // 3 days worth

    const recentAvgConversionRate = recent.reduce((sum, d) => sum + d.conversionRate, 0) / recent.length
    const previousAvgConversionRate = previous.reduce((sum, d) => sum + d.conversionRate, 0) / previous.length
    const conversionChange = ((recentAvgConversionRate - previousAvgConversionRate) / previousAvgConversionRate) * 100

    // Generate cause → effect → impact insights
    if (Math.abs(visibilityChange) > 8) {
      const direction = visibilityChange > 0 ? "rose" : "dropped"
      const impactDirection = impressionsChange > 0 ? "boosted" : "fell"
      const revenueDirection = revenueChange > 0 ? "gained" : "slipped"

      return `Visibility ${direction} ${Math.abs(visibilityChange).toFixed(0)}% last week → impressions ${impactDirection} ${Math.abs(impressionsChange).toFixed(0)}% → revenue ${revenueDirection} £${(revenueImpact / 1000).toFixed(1)}k.`
    }

    if (Math.abs(cpcChange) > 5 && Math.abs(conversionChange) < 3) {
      const cpcDirection = cpcChange > 0 ? "rose" : "fell"
      const wasteDirection = cpcChange > 0 ? "increased" : "decreased"
      const wastedSpend = (Math.abs(recentAvgCpc - previousAvgCpc) * recentAvgImpressions * 3) / 1000 // 3 days worth

      return `CPC ${cpcDirection} ${Math.abs(cpcChange).toFixed(0)}%, but conversions stayed flat → wasted spend ${wasteDirection} by £${wastedSpend.toFixed(1)}k.`
    }

    if (Math.abs(impressionsChange) > 10) {
      const impressionDirection = impressionsChange > 0 ? "surged" : "dropped"
      const revenueDirection = revenueChange > 0 ? "driving" : "causing"
      const revenueImpactDirection = revenueChange > 0 ? "gains" : "losses"

      return `Impressions ${impressionDirection} ${Math.abs(impressionsChange).toFixed(0)}% → ${revenueDirection} revenue ${revenueImpactDirection} of £${(revenueImpact / 1000).toFixed(1)}k.`
    }

    if (Math.abs(revenueChange) > 15) {
      const revenueDirection = revenueChange > 0 ? "jumped" : "fell"
      const cause =
        Math.abs(visibilityChange) > Math.abs(cpcChange)
          ? `visibility ${visibilityChange > 0 ? "improvements" : "decline"}`
          : `CPC ${cpcChange > 0 ? "increases" : "reductions"}`

      return `Revenue ${revenueDirection} ${Math.abs(revenueChange).toFixed(0)}% (£${(revenueImpact / 1000).toFixed(1)}k) → driven by ${cause}.`
    }

    // Stable performance
    return `Performance stable with visibility at ${recentAvgVisibility.toFixed(0)}% → impressions steady → revenue holding at £${(recentAvgRevenue / 1000).toFixed(1)}k daily.`
  }, [trendData])

  const spikeAnnotations = useMemo<SpikeAnnotation[]>(() => {
    const annotations: SpikeAnnotation[] = []

    // Only generate auto-detected annotations if NOT showing the special Google impressions insight
    const isSpecialInsight =
      showAIInsights &&
      insightConfig &&
      insightConfig.channel === "google" &&
      selectedChannel === "google" &&
      insightConfig.metrics.includes("impressions") &&
      selectedMetrics.includes("impressions")

    if (
      insightConfig &&
      insightConfig.channel === "google" &&
      selectedChannel === "google" &&
      insightConfig.metrics.includes("impressions") &&
      selectedMetrics.includes("impressions")
    ) {
      const customAnnotations: SpikeAnnotation[] = []

      // Day 5 (Oct 3): Positive insight - Visibility improvement
      const day5DataPoint = trendData[4] // Index 4 = day 5
      if (day5DataPoint && selectedMetrics[0]) {
        const metricKey = selectedMetrics[0] as keyof TrendDataPoint
        const value = day5DataPoint[metricKey]
        if (typeof value === "number") {
          customAnnotations.push({
            date: day5DataPoint.date,
            metricKey: metricKey,
            value: value,
            changePercent: 5.2,
            trendDirection: "improving",
            message: "visibility improved",
            cause: "Enhanced product attributes and image quality updates",
            nextStep: "Continue optimizing product data across all channels",
            isSpike: true, // Positive
            trendPercent: 3.8,
            firstDetected: day5DataPoint.date,
          })
        }
      }

      // Day 10 (Oct 8): Negative insight - Minor performance dip
      const day10DataPoint = trendData[9] // Index 9 = day 10
      if (day10DataPoint && selectedMetrics[0]) {
        const metricKey = selectedMetrics[0] as keyof TrendDataPoint
        const value = day10DataPoint[metricKey]
        if (typeof value === "number") {
          customAnnotations.push({
            date: day10DataPoint.date,
            metricKey: metricKey,
            value: value,
            changePercent: -3.5,
            trendDirection: "worsening",
            message: "minor CPC increase detected",
            cause: "Increased competition in key product categories",
            nextStep: "Review bid strategies and adjust budget allocation",
            isSpike: false, // Negative
            trendPercent: -2.1,
            firstDetected: day10DataPoint.date,
          })
        }
      }

      // Day 15 (Oct 13): Positive insight - CTR improvement
      const day15DataPoint = trendData[14] // Index 14 = day 15
      if (day15DataPoint && selectedMetrics[0]) {
        const metricKey = selectedMetrics[0] as keyof TrendDataPoint
        const value = day15DataPoint[metricKey]
        if (typeof value === "number") {
          customAnnotations.push({
            date: day15DataPoint.date,
            metricKey: metricKey,
            value: value,
            changePercent: 4.8,
            trendDirection: "improving",
            message: "click-through rate up",
            cause: "Improved ad copy and product title optimization",
            nextStep: "Scale successful ad variations across campaigns",
            isSpike: true, // Positive
            trendPercent: 3.2,
            firstDetected: day15DataPoint.date,
          })
        }
      }

      // Day 19 (Oct 19): Main feed issue annotation - KEEP AS IS
      const oct19DataPoint = trendData[18] // Index 18 = day 19
      if (oct19DataPoint && selectedMetrics[0]) {
        const metricKey = selectedMetrics[0] as keyof TrendDataPoint
        const value = oct19DataPoint[metricKey]
        if (typeof value === "number") {
          customAnnotations.push({
            date: oct19DataPoint.date,
            metricKey: metricKey,
            value: value,
            changePercent: -8.5,
            trendDirection: "worsening",
            message: "feed issue detected",
            cause: "feed issue detected",
            nextStep: "Review and update product images",
            isSpike: false, // Negative
            trendPercent: -2.5,
            firstDetected: oct19DataPoint.date,
          })
        }
      }

      return customAnnotations
    }

    if (trendData.length >= 8 && showAIInsights && !isSpecialInsight) {
      selectedMetrics.forEach((metricKey) => {
        const metric = metrics.find((m) => m.key === metricKey)
        if (!metric) return

        // Calculate 7-day rolling average for each point
        for (let i = 7; i < trendData.length; i++) {
          const currentValue = trendData[i][metricKey]

          // Calculate 7-day average from previous 7 days
          const sevenDayAvg = trendData.slice(i - 7, i).reduce((sum, d) => sum + d[metricKey], 0) / 7

          // Calculate variance percentage
          const variance = ((currentValue - sevenDayAvg) / sevenDayAvg) * 100

          if (Math.abs(variance) >= 10) {
            const isSpike = variance > 0

            let message = ""
            let cause = ""
            let nextStep = ""
            let primaryDriver = ""

            if (selectedChannel === "all" && Object.keys(channelBreakdownData).length > 0) {
              const channelDeviations: { channel: string; deviation: number; change: number }[] = []

              Object.entries(channelBreakdownData).forEach(([channel, data]) => {
                if (data[i] && data[i - 7]) {
                  const channelCurrent = data[i][metricKey]
                  const channelPrevAvg = data.slice(i - 7, i).reduce((sum: number, d: any) => sum + d[metricKey], 0) / 7
                  const channelDeviation = ((channelCurrent - channelPrevAvg) / channelPrevAvg) * 100

                  channelDeviations.push({
                    channel,
                    deviation: channelDeviation,
                    change: channelDeviation,
                  })
                }
              })

              // Find the channel with the largest absolute deviation
              const sortedDeviations = channelDeviations.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
              const primaryChannel = sortedDeviations[0]

              if (primaryChannel) {
                const channelNames: Record<string, string> = {
                  google: "Google",
                  meta: "Meta",
                  tiktok: "TikTok",
                  pinterest: "Pinterest",
                  agentic: "Agentic Commerce",
                }
                const channelName = channelNames[primaryChannel.channel] || primaryChannel.channel
                primaryDriver = `${channelName} (${primaryChannel.change > 0 ? "+" : ""}${primaryChannel.change.toFixed(0)}%)`

                if (metricKey === "visibilityScore") {
                  if (isSpike) {
                    message = `Visibility up ${Math.abs(variance).toFixed(1)}%, led by ${primaryDriver}`
                    cause = "Feed quality improvements or attribute completeness"
                    nextStep = `Maintain ${channelName} feed quality standards and replicate across channels`
                  } else {
                    message = `Visibility down ${Math.abs(variance).toFixed(1)}%, mainly due to ${primaryDriver}`
                    cause = "Likely disapprovals/missing GTIN or policy rejections"
                    nextStep = `Check ${channelName} feed diagnostics and resolve disapprovals`
                  }
                } else if (metricKey === "impressions") {
                  if (isSpike) {
                    message = `Impressions up ${Math.abs(variance).toFixed(1)}%, driven by ${primaryDriver}`
                    cause = "Budget increase or improved feed coverage"
                    nextStep = `Scale ${channelName} budget allocation to capitalize on momentum`
                  } else {
                    message = `Impressions dropped ${Math.abs(variance).toFixed(1)}%, mainly due to ${primaryDriver}`
                    cause = "feed issue detected"
                    nextStep = `Review ${channelName} inventory levels and campaign sync`
                  }
                } else if (metricKey === "avgCpc") {
                  if (isSpike) {
                    message = `CPC up ${Math.abs(variance).toFixed(1)}%, led by ${primaryDriver}`
                    cause = "Auction competition increased"
                    nextStep = `Reduce high-CPC bids on ${channelName} or adjust targeting`
                  } else {
                    message = `CPC down ${Math.abs(variance).toFixed(1)}%, driven by ${primaryDriver}`
                    cause = "Bidding efficiency improved"
                    nextStep = `Scale budget to ${channelName} winning set`
                  }
                } else if (metricKey === "roas") {
                  if (isSpike) {
                    message = `ROAS up ${Math.abs(variance).toFixed(1)}%, led by ${primaryDriver}`
                    cause = "Higher CTR and conversion rate"
                    nextStep = `Replicate ${channelName} targeting approach across other channels`
                  } else {
                    message = `ROAS down ${Math.abs(variance).toFixed(1)}%, mainly due to ${primaryDriver}`
                    cause = "CPC increases or conversion rate decline"
                    nextStep = `Review ${channelName} segment builder coverage and bidding strategy`
                  }
                } else if (metricKey === "revenue") {
                  if (isSpike) {
                    message = `Revenue up ${Math.abs(variance).toFixed(1)}%, driven by ${primaryDriver}`
                    cause = "Strong conversion performance"
                    nextStep = `Scale ${channelName} budget allocation and check inventory`
                  } else {
                    message = `Revenue down ${Math.abs(variance).toFixed(1)}%, mainly due to ${primaryDriver}`
                    cause = "Budget shift or stockouts"
                    nextStep = `Increase ${channelName} budget allocation and check inventory`
                  }
                } else {
                  message = isSpike
                    ? `${metric.label} up ${Math.abs(variance).toFixed(1)}%, led by ${primaryDriver}`
                    : `${metric.label} down ${Math.abs(variance).toFixed(1)}%, mainly due to ${primaryDriver}`
                  cause = isSpike ? "Performance improvement detected" : "Performance decline detected"
                  nextStep = `Review ${channelName} recent changes and campaign settings`
                }
              }
            } else {
              // Original single-channel logic
              if (metricKey === "visibilityScore") {
                if (isSpike) {
                  message = `Visibility +${Math.abs(variance).toFixed(0)}%`
                  cause = "Feed quality improvements or attribute completeness"
                  nextStep = "Maintain feed quality standards"
                } else {
                  message = `Visibility −${Math.abs(variance).toFixed(0)}%`
                  cause = "Likely disapprovals/missing GTIN or policy rejections"
                  nextStep = "Check GMC diagnostics"
                }
              } else if (metricKey === "impressions") {
                if (isSpike) {
                  message = `Impressions +${Math.abs(variance).toFixed(0)}%`
                  cause = "Budget increase or improved feed coverage"
                  nextStep = "Monitor conversion quality"
                } else {
                  message = `Impressions −${Math.abs(variance).toFixed(0)}%`
                  cause = "feed issue detected"
                  nextStep = "Restore inventory or pause bids"
                }
              } else if (metricKey === "avgCpc") {
                if (isSpike) {
                  message = `CPC +${Math.abs(variance).toFixed(0)}%`
                  cause = "Auction competition increased"
                  nextStep = "Reduce high-CPC bids or review targeting"
                } else {
                  message = `CPC −${Math.abs(variance).toFixed(0)}%`
                  cause = "Bidding efficiency improved or lower competition"
                  nextStep = "Scale budget to winning set"
                }
              } else if (metricKey === "roas") {
                if (isSpike) {
                  message = `ROAS +${Math.abs(variance).toFixed(0)}%`
                  cause = "CPC down and CTR up on top SKUs"
                  nextStep = "Scale budget to winning set"
                } else {
                  message = `ROAS −${Math.abs(variance).toFixed(0)}%`
                  cause = "CPC increases or conversion rate decline"
                  nextStep = "Review segment builder coverage"
                }
              } else if (metricKey === "revenue") {
                if (isSpike) {
                  message = `Revenue +${Math.abs(variance).toFixed(0)}%`
                  cause = "Strong conversion performance on key products"
                  nextStep = "Scale winning products"
                } else {
                  message = `Revenue −${Math.abs(variance).toFixed(0)}%`
                  cause = "Budget shift or stockouts"
                  nextStep = "Rebalance budgets"
                }
              } else {
                message = isSpike
                  ? `${metric.label} +${Math.abs(variance).toFixed(0)}%`
                  : `${metric.label} −${Math.abs(variance).toFixed(0)}%`
                cause = isSpike ? "Performance improvement detected" : "Performance decline detected"
                nextStep = "Review recent changes and trends"
              }
            }

            let trendDirection: "improving" | "worsening" | "flat" = "flat"
            let trendPercent = 0
            let firstDetected = trendData[i].date

            if (previousPeriodData.length > 0 && previousPeriodData[i]) {
              const previousValue = previousPeriodData[i][metricKey]
              const trendChange = ((currentValue - previousValue) / previousValue) * 100

              if (Math.abs(trendChange) >= 3) {
                // For metrics where higher is better (visibility, ROAS, revenue, impressions)
                const higherIsBetter = ["visibilityScore", "roas", "revenue", "impressions", "conversions"].includes(
                  metricKey,
                )
                // For metrics where lower is better (CPC, return rate, bounce rate)
                const lowerIsBetter = ["avgCpc", "returnRate", "bounceRate"].includes(metricKey)

                if (higherIsBetter) {
                  trendDirection = trendChange > 0 ? "improving" : "worsening"
                } else if (lowerIsBetter) {
                  trendDirection = trendChange < 0 ? "improving" : "worsening"
                } else {
                  trendDirection = isSpike ? "improving" : "worsening"
                }

                trendPercent = trendChange
              }

              // Find first detection date (look back for similar variance)
              for (let j = i - 1; j >= 7; j--) {
                const prevValue = trendData[j][metricKey]
                const prevAvg = trendData.slice(j - 7, j).reduce((sum, d) => sum + d[metricKey], 0) / 7
                const prevVariance = ((prevValue - prevAvg) / prevAvg) * 100

                if (Math.abs(prevVariance) >= 10 && prevVariance > 0 === isSpike) {
                  firstDetected = trendData[j].date
                } else {
                  break
                }
              }
            }

            annotations.push({
              date: trendData[i].date,
              metricKey,
              value: currentValue,
              changePercent: variance,
              message,
              cause,
              nextStep,
              isSpike,
              trendDirection,
              trendPercent,
              firstDetected,
            })
          }
        }
      })
    }

    // The special Oct 19 annotation logic has been moved to the top of the function.
    // This section should only handle auto-generated annotations when the special insight is NOT active.
    // If the special insight IS active, the function returns early with the specific annotation.

    return annotations
  }, [
    trendData,
    selectedMetrics,
    showAIInsights,
    selectedChannel,
    previousPeriodData,
    channelBreakdownData,
    metrics,
    insightConfig,
  ]) // Added metrics and insightConfig dependency

  const aiInsights = useMemo(() => {
    const insights: AIInsight[] = []

    if (trendData.length < 7) {
      return "Not enough data to generate insights."
    }

    const isSpecialInsight =
      showAIInsights &&
      insightConfig &&
      insightConfig.channel === "google" &&
      selectedChannel === "google" && // Added this condition
      insightConfig.metrics.includes("impressions")

    if (isSpecialInsight) {
      // The spikeAnnotations logic already handles the specific annotation for the Google insight.
      // This section should generate *general* AI insights if the special insight isn't active,
      // or perhaps an overarching summary if it is.

      // Let's generate a summary insight when the special condition is met.
      // We can re-use some logic from spikeAnnotations if needed, but the focus here is on the AI summary.

      // Find the date of the "issue" for the Google scenario. This is hardcoded to Oct 19 in the spikeAnnotations logic.
      const issueDate = "Oct 19" // This should ideally be dynamically determined or passed.
      const relevantDataPoint = trendData.find((d) => d.date === issueDate)

      if (relevantDataPoint) {
        const impressions = relevantDataPoint.impressions
        const visibility = relevantDataPoint.visibilityScore
        const impressionsChangePercent = -8.5 // Based on spikeAnnotations example
        const visibilityChangePercent = -15.2 // Based on spikeAnnotations example

        insights.push({
          metric: "AI Summary (Google Impressions Issue)",
          changePercent: impressionsChangePercent,
          cause: `Visibility Index declined by ${visibilityChangePercent.toFixed(1)}% since ${issueDate}, driven by a feed quality issue in Google Shopping. AI diagnostics identified blurry or low-resolution images across 420 SKUs, reducing ad delivery and visibility.`,
          action:
            "Use AI Image Enhancement to repair or replace low-quality visuals, then resync updated assets to improve feed performance.", // Custom action type for this specific issue
          trend: "", // Trend is covered in cause
          firstDetected: issueDate,
          actionType: "image_quality_issues",
          targetChannel: "google",
          targetMetrics: ["impressions", "visibilityScore"],
        })
      } else {
        // Fallback if Oct 19 data is not found or date format differs
        insights.push({
          metric: "AI Summary (Google Impressions Issue)",
          changePercent: -15,
          cause: `Recent performance dip identified. Likely cause: feed quality issues impacting visibility. Recommended action: Investigate Google Shopping feed diagnostics.`,
          action: "Review and update product images for quality.",
          trend: "Worsening",
          firstDetected: "Unknown",
          actionType: "image_quality_issues",
          targetChannel: "google",
          targetMetrics: ["impressions", "visibilityScore"],
        })
      }

      return insights
    }

    if (selectedChannel === "all" && Object.keys(channelBreakdownData).length > 0) {
      // Analyze each metric across all channels
      const recent = trendData.slice(-7)
      const previous = trendData.slice(-14, -7)

      selectedMetrics.slice(0, 2).forEach((metricKey) => {
        const metric = metrics.find((m) => m.key === metricKey)
        if (!metric) return

        // Calculate overall change
        const recentAvg = recent.reduce((sum, d) => sum + (d[metricKey] || 0), 0) / recent.length
        const previousAvg = previous.reduce((sum, d) => sum + (d[metricKey] || 0), 0) / previous.length
        const overallChange = ((recentAvg - previousAvg) / previousAvg) * 100

        if (Math.abs(overallChange) >= 10) {
          // Find which channel contributed most
          const channelContributions: { channel: string; change: number }[] = []

          Object.entries(channelBreakdownData).forEach(([channel, data]) => {
            if (data.length >= 14) {
              const channelRecent = data.slice(-7)
              const channelPrevious = data.slice(-14, -7)

              const channelRecentAvg =
                channelRecent.reduce((sum: number, d: any) => sum + (d[metricKey] || 0), 0) / channelRecent.length
              const channelPreviousAvg =
                channelPrevious.reduce((sum: number, d: any) => sum + (d[metricKey] || 0), 0) / channelPrevious.length
              const channelChange = ((channelRecentAvg - channelPreviousAvg) / channelPreviousAvg) * 100

              channelContributions.push({ channel, change: channelChange })
            }
          })

          // Sort by absolute change
          const sortedContributions = channelContributions.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
          const primaryChannel = sortedContributions[0]

          if (primaryChannel) {
            const channelNames: Record<string, string> = {
              google: "Google",
              meta: "Meta",
              tiktok: "TikTok",
              pinterest: "Pinterest",
              agentic: "Agentic Commerce",
            }
            const channelName = channelNames[primaryChannel.channel] || primaryChannel.channel
            const driverText = `${channelName} (${primaryChannel.change > 0 ? "+" : ""}${primaryChannel.change.toFixed(0)}%)`

            let cause = ""
            let action = ""

            if (metricKey === "impressions") {
              if (overallChange < 0) {
                cause = `${channelName} responsible for ${Math.abs(primaryChannel.change).toFixed(0)}% of lost impressions. Probable cause: budget dip or excluded SKUs`
                action = `Review ${channelName} budget pacing`
              } else {
                cause = `Driven by ${driverText}. Probable cause: budget increase or improved coverage`
                action = `Scale ${channelName} budget allocation`
              }
            } else if (metricKey === "roas") {
              if (overallChange > 0) {
                cause = `Led by ${driverText}. Probable cause: higher CTR and conversion rate`
                action = `Replicate ${channelName} targeting approach across channels`
              } else {
                cause = `Mainly due to ${driverText}. Probable cause: CPC increases or conversion decline`
                action = `Review ${channelName} segment builder coverage`
              }
            } else if (metricKey === "visibilityScore") {
              if (Math.abs(overallChange) < 5) {
                const underperformer = sortedContributions.find((c) => c.change < -5)
                if (underperformer) {
                  const underperformerName = channelNames[underperformer.channel] || underperformer.channel
                  cause = `Stable overall, but ${underperformerName} underperformed (${underperformer.change.toFixed(0)}%)`
                  action = `Update ${underperformerName} feed attributes`
                } else {
                  cause = `Stable across all channels`
                  action = "Continue monitoring for changes"
                }
              } else if (overallChange < 0) {
                cause = `Mainly due to ${driverText}. Probable cause: feed disapprovals or missing attributes`
                action = `Check ${channelName} feed diagnostics`
              } else {
                cause = `Led by ${driverText}. Probable cause: feed quality improvements`
                action = `Maintain ${channelName} feed quality standards`
              }
            } else if (metricKey === "avgCpc") {
              if (overallChange > 0) {
                cause = `Led by ${driverText}. Probable cause: auction competition increased`
                action = `Reduce high-CPC bids on ${channelName}`
              } else {
                cause = `Driven by ${driverText}. Probable cause: bidding efficiency improved`
                action = `Scale budget to ${channelName} winning set`
              }
            } else if (metricKey === "revenue") {
              if (overallChange > 0) {
                cause = `Driven by ${driverText}. Probable cause: strong conversion performance`
                action = `Scale ${channelName} winning products`
              } else {
                cause = `Mainly due to ${driverText}. Probable cause: budget shift or stockouts`
                action = `Increase ${channelName} budget allocation`
              }
            } else {
              cause = `Driven by ${driverText}`
              action = `Review ${channelName} recent changes`
            }

            const trendVsPrevious =
              Math.abs(overallChange) < 3
                ? "flat"
                : overallChange > 0
                  ? `improving (+${overallChange.toFixed(0)}%)`
                  : `worsening (${overallChange.toFixed(0)}%)`

            insights.push({
              metric: metric.label,
              changePercent: overallChange,
              cause,
              action,
              trend: `Trend vs last period: ${trendVsPrevious}`,
              firstDetected: trendData[trendData.length - 7].date,
              targetChannel: primaryChannel.channel,
              targetMetrics: [metricKey, "visibilityScore"],
            })
          }
        }
      })
    } else if (compareChannel) {
      // Calculate comparative metrics
      const recentData = trendData.slice(-7)

      // Compare ROAS
      const primaryRoas = recentData.reduce((sum, d) => sum + (d.roas || 0), 0) / recentData.length
      const compareRoas = recentData.reduce((sum, d) => sum + (d.roas_compare || 0), 0) / recentData.length
      const roasDelta = ((primaryRoas - compareRoas) / compareRoas) * 100

      if (Math.abs(roasDelta) >= 10) {
        const leader = roasDelta > 0 ? getChannelName(selectedChannel) : getChannelName(compareChannel)
        const laggard = roasDelta > 0 ? getChannelName(compareChannel) : getChannelName(selectedChannel)

        // Check CPC difference
        const primaryCpc = recentData.reduce((sum, d) => sum + (d.avgCpc || 0), 0) / recentData.length
        const compareCpc = recentData.reduce((sum, d) => sum + (d.avgCpc_compare || 0), 0) / recentData.length
        const cpcDelta = ((primaryCpc - compareCpc) / compareCpc) * 100

        const cause =
          Math.abs(cpcDelta) >= 10
            ? `CPC ${cpcDelta < 0 ? "−" : "+ "}${Math.abs(cpcDelta).toFixed(0)}%`
            : "better conversion efficiency"

        insights.push({
          metric: "ROAS",
          changePercent: Math.abs(roasDelta),
          cause: `${leader} outperforming ${laggard} due to ${cause}`,
          action: `Consider shifting 10–15% budget to ${leader}`,
          trend: "Comparative analysis",
          firstDetected: trendData[trendData.length - 7].date,
        })
      }

      // Compare Visibility
      const primaryVis = recentData.reduce((sum, d) => sum + (d.visibilityScore || 0), 0) / recentData.length
      const compareVis = recentData.reduce((sum, d) => sum + (d.visibilityScore_compare || 0), 0) / recentData.length
      const visDelta = ((primaryVis - compareVis) / compareVis) * 100

      if (Math.abs(visDelta) >= 10) {
        const higher = visDelta > 0 ? getChannelName(selectedChannel) : getChannelName(compareChannel)
        const lower = visDelta > 0 ? getChannelName(compareChannel) : getChannelName(selectedChannel)

        insights.push({
          metric: "Visibility",
          changePercent: Math.abs(visDelta),
          cause: `${lower} visibility ${Math.abs(visDelta).toFixed(0)}% lower than ${higher}`,
          action: `Investigate ${lower} feed coverage gaps`,
          trend: "Comparative analysis",
          firstDetected: trendData[trendData.length - 7].date,
        })
      }
    } else {
      const recent = trendData.slice(-7)
      const previous = trendData.slice(-14, -7)

      // Check Visibility
      const recentVis = recent.reduce((sum, d) => sum + (d.visibilityScore || 0), 0) / recent.length
      const previousVis = previous.reduce((sum, d) => sum + (d.visibilityScore || 0), 0) / previous.length
      const visChange = ((recentVis - previousVis) / previousVis) * 100

      if (Math.abs(visChange) >= 10) {
        const trendVsPrevious =
          Math.abs(visChange) < 3
            ? "flat"
            : visChange > 0
              ? `improving (+${visChange.toFixed(0)}%)`
              : `worsening (${visChange.toFixed(0)}%)`

        insights.push({
          metric: "Visibility",
          changePercent: visChange,
          cause: visChange < 0 ? "Likely cause: disapprovals/missing GTIN" : "Likely cause: feed quality improvements",
          action: visChange < 0 ? "Check GMC diagnostics" : "Maintain feed quality standards",
          trend: `Trend vs last period: ${trendVsPrevious}`,
          firstDetected: trendData[trendData.length - 7].date,
        })
      }

      // Check Impressions
      const recentImp = recent.reduce((sum, d) => sum + (d.impressions || 0), 0) / recent.length
      const previousImp = previous.reduce((sum, d) => sum + (d.impressions || 0), 0) / previous.length
      const impChange = ((recentImp - previousImp) / previousImp) * 100

      if (Math.abs(impChange) >= 10) {
        const trendVsPrevious =
          Math.abs(impChange) < 3
            ? "flat"
            : impChange > 0
              ? `improving (+${impChange.toFixed(0)}%)`
              : `worsening (${impChange.toFixed(0)}%)`

        insights.push({
          metric: "Impressions",
          changePercent: impChange,
          cause: impChange < 0 ? "feed issue detected" : "Likely cause: budget increase or improved coverage",
          action: impChange < 0 ? "Restore inventory or pause bids" : "Monitor conversion quality",
          trend: `Trend vs last period: ${trendVsPrevious}`,
          firstDetected: trendData[trendData.length - 7].date,
        })
      }

      // Check ROAS
      const recentRoas = recent.reduce((sum, d) => sum + (d.roas || 0), 0) / recent.length
      const previousRoas = previous.reduce((sum, d) => sum + (d.roas || 0), 0) / previous.length
      const roasChange = ((recentRoas - previousRoas) / previousRoas) * 100

      if (Math.abs(roasChange) >= 10) {
        const trendVsPrevious =
          Math.abs(roasChange) < 3
            ? "flat"
            : roasChange > 0
              ? `improving (+${roasChange.toFixed(0)}%)`
              : `worsening (${roasChange.toFixed(0)}%)`

        insights.push({
          metric: "ROAS",
          changePercent: roasChange,
          cause:
            roasChange > 0
              ? "Likely cause: CPC down and CTR up on top SKUs"
              : "Likely cause: CPC increases or conversion decline",
          action: roasChange > 0 ? "Scale budget to winning set" : "Review segment builder coverage",
          trend: `Trend vs last period: ${trendVsPrevious}`,
          firstDetected: trendData[trendData.length - 7].date,
        })
      }

      // Check Revenue
      const recentRev = recent.reduce((sum, d) => sum + (d.revenue || 0), 0) / recent.length
      const previousRev = previous.reduce((sum, d) => sum + (d.revenue || 0), 0) / previous.length
      const revChange = ((recentRev - previousRev) / previousRev) * 100

      if (Math.abs(revChange) >= 10) {
        const trendVsPrevious =
          Math.abs(revChange) < 3
            ? "flat"
            : revChange > 0
              ? `improving (+${revChange.toFixed(0)}%)`
              : `worsening (${revChange.toFixed(0)}%)`

        insights.push({
          metric: "Revenue",
          changePercent: revChange,
          cause:
            revChange > 0 ? "Likely cause: strong conversion performance" : "Likely cause: budget shift or stockouts",
          action: revChange > 0 ? "Scale winning products" : "Rebalance budgets",
          trend: `Trend vs last period: ${trendVsPrevious}`,
          firstDetected: trendData[trendData.length - 7].date,
        })
      }

      // Check CPC
      const recentCpc = recent.reduce((sum, d) => sum + (d.avgCpc || 0), 0) / recent.length
      const previousCpc = previous.reduce((sum, d) => sum + (d.avgCpc || 0), 0) / previous.length
      const cpcChange = ((recentCpc - previousCpc) / previousCpc) * 100

      if (Math.abs(cpcChange) >= 10) {
        const trendVsPrevious =
          Math.abs(cpcChange) < 3
            ? "flat"
            : cpcChange < 0
              ? `improving (${cpcChange.toFixed(0)}%)`
              : `worsening (+${cpcChange.toFixed(0)}%)`

        insights.push({
          metric: "Avg CPC",
          changePercent: cpcChange,
          cause:
            cpcChange > 0 ? "Likely cause: auction competition increased" : "Likely cause: bidding efficiency improved",
          action: cpcChange > 0 ? "Reduce high-CPC bids" : "Scale budget to winning set",
          trend: `Trend vs last period: ${trendVsPrevious}`,
          firstDetected: trendData[trendData.length - 7].date,
        })
      }
    }

    // </CHANGE> Update default insight to show channel name instead of always "Overall"
    if (insights.length === 0) {
      const displayName = selectedChannel === "all" ? "Overall" : getChannelName(selectedChannel)

      insights.push({
        metric: "AI Summary (Performance Overview)", // Updated metric label
        changePercent: -9.8, // Hardcoded value for the example
        cause:
          "Visibility Index declined by 9.8%, driven by a feed quality issue in Google Shopping. AI diagnostics identified blurry or low-resolution images across 420 SKUs, reducing ad delivery and visibility.", // Detailed cause
        action:
          "Use AI Image Enhancement to repair or replace low-quality visuals, then resync updated assets to improve feed performance.", // Specific action
        trend: "", // Empty trend for this summary
        firstDetected: "", // No specific detection date for this summary
        actionType: "image_quality_issues",
      })
    }

    return insights.slice(0, 2) // Return max 2 insights
  }, [
    trendData,
    showAIInsights,
    selectedChannel,
    compareChannel,
    channelBreakdownData,
    selectedMetrics,
    visibilityIndexMode,
    metrics, // Added metrics dependency
    insightConfig, // Added insightConfig dependency
  ]) // Add visibilityIndexMode dependency

  const summaryMetrics = useMemo(() => {
    if (trendData.length === 0) return null

    // If an annotation is clicked, show metrics for that specific date
    if (clickedAnnotation) {
      const dataPoint = trendData.find((d) => d.date === clickedAnnotation.date)
      if (dataPoint) {
        return {
          impressions: dataPoint.impressions,
          clicks: dataPoint.clicks,
          revenue: dataPoint.revenue,
          roas: dataPoint.roas,
          visibility: dataPoint.visibilityScore,
          date: clickedAnnotation.date,
          isFiltered: true,
        }
      }
    }

    // Otherwise show overall totals
    const totalImpressions = trendData.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = trendData.reduce((sum, d) => sum + d.clicks, 0)
    const totalRevenue = trendData.reduce((sum, d) => sum + d.revenue, 0)
    const avgRoas = trendData.reduce((sum, d) => sum + d.roas, 0) / trendData.length
    const avgVisibility = trendData.reduce((sum, d) => sum + d.visibilityScore, 0) / trendData.length

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      revenue: totalRevenue,
      roas: avgRoas,
      visibility: avgVisibility,
      isFiltered: false,
    }
  }, [trendData, clickedAnnotation])

  const channelInsight = useMemo(() => {
    if (selectedChannel === "all") {
      return "Meta outperforming on CTR, but lower conversion rate vs. Google."
    }

    const channelNames: Record<string, string> = {
      google: "Google",
      meta: "Meta",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      microsoft: "Microsoft",
    }

    const channelName = channelNames[selectedChannel] || selectedChannel

    if (selectedChannel === "meta") {
      return `${channelName} driving +12% ROI increase this week with strong engagement.`
    } else if (selectedChannel === "google") {
      return `${channelName} Shopping visibility dropped 4% — likely GTIN issue affecting feed quality.`
    } else if (selectedChannel === "tiktok") {
      return `${channelName} gaining share with stable ROAS — consider increasing budget allocation.`
    }

    return `${channelName} performance stable with consistent conversion rates.`
  }, [selectedChannel])

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricKey) ? prev.filter((m) => m !== metricKey) : [...prev, metricKey],
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".relative")) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // const getChannelName = (channel: string) => { ... }

  const selectedMetricConfigs = selectedMetrics
    .map((key) => metrics.find((m) => m.key === key))
    .filter(Boolean) as MetricConfig[]
  const leftAxisMetric =
    selectedMetricConfigs.find((m) => m.yAxisId === "percentage" || m.yAxisId === "currency") ||
    selectedMetricConfigs[0]
  const rightAxisMetric =
    selectedMetricConfigs.find(
      (m) => m.yAxisId !== leftAxisMetric?.yAxisId && (m.yAxisId === "volume" || m.yAxisId === "ratio"),
    ) || selectedMetricConfigs[1]

  // Custom tooltip component to only show selected metrics with proper formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    // Don't show regular tooltip when hovering over an annotation
    if (!active || !payload || payload.length === 0 || hoveredAnnotation) return null

    // Use a Map to ensure each metric appears only once
    const uniqueMetrics = new Map<string, any>()

    payload.forEach((entry: any) => {
      const dataKey = entry.dataKey.replace("_compare", "")
      if (selectedMetrics.includes(dataKey)) {
        const isCompare = entry.dataKey.includes("_compare")
        const key = `${dataKey}-${isCompare ? "compare" : "primary"}`

        if (!uniqueMetrics.has(key)) {
          uniqueMetrics.set(key, {
            ...entry,
            metricKey: dataKey,
            isCompare,
          })
        }
      }
    })

    if (uniqueMetrics.size === 0) return null

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <div className="font-semibold text-gray-900 mb-2 text-sm">{label}</div>
        {Array.from(uniqueMetrics.values()).map((entry, index) => {
          const channelName = entry.isCompare ? getChannelName(compareChannel || "") : getChannelName(selectedChannel)

          const metricIndex = selectedMetrics.indexOf(entry.metricKey)
          const isLeftAxis = metricIndex === 0
          const axisColor = isLeftAxis ? leftAxisMetric?.color : rightAxisMetric?.color

          // Find the correct metric configuration to use its label and format
          const currentMetricConfig = metrics.find((m) => m.key === entry.metricKey)

          return (
            <div
              key={`${entry.metricKey}-${entry.isCompare}-${index}`}
              className="flex items-center justify-between gap-4 py-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: axisColor || entry.color }} />
                <span className="text-sm text-gray-700">
                  {currentMetricConfig?.label} {/* Use the label from the found config */}
                  {compareChannel && <span className="text-gray-500 ml-1">({channelName})</span>}
                </span>
              </div>
              <span className="text-sm font-semibold" style={{ color: axisColor || entry.color }}>
                {currentMetricConfig?.format(entry.value)} {/* Use the format from the found config */}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // The isDifferentFromDashboard variable is declared here.
  const isDifferentFromDashboard = chartDateRange !== dateRange

  // Early returns AFTER all hooks
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>No products selected for trend analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Select products or create a segment to view performance trends</p>
        </CardContent>
      </Card>
    )
  }

  // If collapsed, show the compact view like segment builder
  if (isCollapsed) {
    return (
      <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Channel Performance Trends</h3>
              <p className="text-sm text-gray-600">
                Track performance metrics across {products.length} product{products.length !== 1 ? "s" : ""} over{" "}
                {chartDateRange} days
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(false)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 font-medium"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Expand
          </Button>
        </div>
      </div>
    )
  }

  const handleInsightClick = (insight: AIInsight) => {
    setClickedInsight(insight)
    // Trigger the onInsightAction callback if provided
    if (onInsightAction && insight.targetChannel && insight.actionType) {
      onInsightAction(`VIEW_CHANNEL_DETAIL_${insight.targetChannel}_${insight.actionType}`)
    } else if (onInsightAction && insight.targetChannel) {
      onInsightAction(`VIEW_CHANNEL_DETAIL_${insight.targetChannel}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Channel Performance Trends</CardTitle>
            <CardDescription>Analyse performance movements and cross-channel shifts over time</CardDescription>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-insights-toggle" className="text-sm font-medium cursor-pointer">
                Show AI Insights
              </Label>
              <Switch
                id="ai-insights-toggle"
                checked={showAIInsights}
                onCheckedChange={setShowAIInsights}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Channel Type:</Label>
              <Select value={selectedChannelType} onValueChange={setSelectedChannelType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="paid-search">Paid Search</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="ai-commerce">AI Commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Partner:</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedChannelType === "all" && <SelectItem value="all">All Partners</SelectItem>}
                  {availablePartners.map((partner) => (
                    <SelectItem key={partner} value={partner}>
                      {getChannelName(partner)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!compareChannel ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompareDropdown(!showCompareDropdown)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Compare Partner
                </Button>
                {showCompareDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-[220px] bg-white border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    <div className="p-1">
                      {[
                        "google",
                        "microsoft",
                        "meta",
                        "tiktok",
                        "pinterest",
                        "awin",
                        "rakuten",
                        "amazon",
                        "ebay",
                        "agentic",
                        "perplexity",
                      ]
                        .filter((ch) => ch !== selectedChannel)
                        .map((channel) => (
                          <button
                            key={channel}
                            onClick={() => {
                              setCompareChannel(channel)
                              setShowCompareDropdown(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                          >
                            {getChannelName(channel)}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  vs {getChannelName(compareChannel)}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setCompareChannel(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Dropdown for metric selection */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-[200px] justify-between bg-transparent"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Select Metrics
                <ChevronDown className="h-4 w-4" />
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-[280px] bg-white border rounded-md shadow-lg z-50 max-h-[400px] overflow-hidden">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search metrics..."
                        value={metricSearchQuery}
                        onChange={(e) => setMetricSearchQuery(e.target.value)}
                        className="pl-9 h-8"
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Available Metrics</div>
                      {filteredMetrics.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No metrics found matching "{metricSearchQuery}"
                        </div>
                      ) : (
                        filteredMetrics.map((metric) => (
                          <div
                            key={metric.key}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => toggleMetric(metric.key)}
                          >
                            <div className="flex items-center justify-center w-4 h-4">
                              {selectedMetrics.includes(metric.key) && (
                                <Check className="h-3 w-3" style={{ color: metric.color }} />
                              )}
                            </div>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                            <span className="text-sm flex-1">{metric.label}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapse/Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-gray-600 font-medium">Collapse</span>
            </Button>
          </div>
        </div>

        {selectedMetrics.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-sm font-medium text-gray-600">Showing:</span>
            <div className="flex flex-wrap gap-2">
              {selectedMetrics.map((metricKey) => {
                const metric = metrics.find((m) => m.key === metricKey)
                if (!metric) return null
                return (
                  <Badge
                    key={metricKey}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${metric.color}15`,
                      color: metric.color,
                      borderColor: `${metric.color}30`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                    {metric.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Chart Controls Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Chart Dates:</Label>
            <Select value={chartDateRange} onValueChange={setChartDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isDifferentFromDashboard && (
            <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              <span>Different from dashboard dates</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartDateRange(dateRange)}
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 text-xs h-6 px-2"
              >
                Match
              </Button>
            </div>
          )}
        </div>

        <div className="h-80 w-full mb-6" data-chart>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <defs>
                {selectedMetrics.map((metricKey) => {
                  const metric = metrics.find((m) => m.key === metricKey)
                  if (!metric) return null
                  return (
                    <>
                      <linearGradient
                        key={`gradient-${metricKey}`}
                        id={`gradient-${metricKey}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor={metric.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                      </linearGradient>
                      {compareChannel && (
                        <linearGradient
                          key={`gradient-${metricKey}-compare`}
                          id={`gradient-${metricKey}-compare`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor={metric.color} stopOpacity={0.1} />
                          <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                        </linearGradient>
                      )}
                    </>
                  )
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />

              {leftAxisMetric && (
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12, fill: leftAxisMetric.color }}
                  tickLine={false}
                  axisLine={{ stroke: leftAxisMetric.color, strokeWidth: 2 }}
                  label={{
                    value: leftAxisMetric.label,
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: leftAxisMetric.color, fontSize: 12 },
                  }}
                  tickFormatter={(value) => leftAxisMetric.format(value)}
                />
              )}

              {rightAxisMetric && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: rightAxisMetric.color }}
                  tickLine={false}
                  axisLine={{ stroke: rightAxisMetric.color, strokeWidth: 2 }}
                  label={{
                    value: rightAxisMetric.label,
                    angle: 90,
                    position: "insideRight",
                    style: { fill: rightAxisMetric.color, fontSize: 12 },
                  }}
                  tickFormatter={(value) => rightAxisMetric.format(value)}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {selectedMetrics.map((metricKey, index) => {
                const metric = metrics.find((m) => m.key === metricKey)
                if (!metric) return null

                const yAxisId = index === 0 ? "left" : index === 1 ? "right" : "left"
                const displayName = compareChannel
                  ? `${metric.label} (${getChannelName(selectedChannel)})`
                  : metric.label

                return (
                  <>
                    <Area
                      key={`area-${metricKey}`}
                      yAxisId={yAxisId}
                      type="monotone"
                      dataKey={metricKey}
                      stroke="none"
                      fill={`url(#gradient-${metricKey})`}
                    />
                    <Line
                      key={`line-${metricKey}`}
                      yAxisId={yAxisId}
                      type="monotone"
                      dataKey={metricKey}
                      stroke={metric.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, stroke: metric.color, strokeWidth: 2, fill: "white" }}
                      name={displayName}
                    />
                  </>
                )
              })}

              {compareChannel &&
                selectedMetrics.map((metricKey, index) => {
                  const metric = metrics.find((m) => m.key === metricKey)
                  if (!metric) return null

                  const yAxisId = index === 0 ? "left" : index === 1 ? "right" : "left"
                  const compareKey = `${metricKey}_compare`
                  const displayName = `${metric.label} (${getChannelName(compareChannel)})`

                  // Use a lighter/dashed version for compare channel
                  return (
                    <>
                      <Area
                        key={`area-${compareKey}`}
                        yAxisId={yAxisId}
                        type="monotone"
                        dataKey={compareKey}
                        stroke="none"
                        fill={`url(#gradient-${metricKey}-compare)`}
                      />
                      <Line
                        key={`line-${compareKey}`}
                        yAxisId={yAxisId}
                        type="monotone"
                        dataKey={compareKey}
                        stroke={metric.color}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={{ r: 4, stroke: metric.color, strokeWidth: 2, fill: "white" }}
                        name={displayName}
                      />
                    </>
                  )
                })}

              {showAIInsights &&
                spikeAnnotations.map((annotation, index) => {
                  const dataPoint = trendData.find((d) => d.date === annotation.date)
                  if (!dataPoint) return null

                  const metric = metrics.find((m) => m.key === annotation.metricKey)
                  if (!metric) return null

                  const metricIndex = selectedMetrics.indexOf(annotation.metricKey)
                  const yAxisId = metricIndex === 0 ? "left" : metricIndex === 1 ? "right" : "left"

                  return (
                    <ReferenceDot
                      key={`annotation-${index}`}
                      x={annotation.date}
                      y={annotation.value}
                      yAxisId={yAxisId}
                      r={0}
                      shape={(props: any) => (
                        <CustomAnnotationDot
                          {...props}
                          annotation={annotation}
                          metrics={metrics}
                          width={props.viewBox?.width}
                          height={props.viewBox?.height}
                          hoveredAnnotation={hoveredAnnotation}
                          onHoverStart={() => setHoveredAnnotation(`${annotation.date}-${annotation.metricKey}`)}
                          onHoverEnd={() => setHoveredAnnotation(null)}
                          onClick={(ann: SpikeAnnotation) => setClickedAnnotation(ann)}
                        />
                      )}
                    />
                  )
                })}

              {insightConfig &&
                insightConfig.channel === "google" &&
                selectedChannel === "google" && // Added this condition
                insightConfig.metrics.includes("impressions") &&
                trendData.length >= 19 && ( // Ensure enough data points exist for the indicator
                  <ReferenceLine
                    x={trendData[18]?.date} // This should correspond to Oct 19 if chartDateRange is >= 30
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: "Image quality issue detected",
                      position: "top",
                      fill: "#ef4444",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {summaryMetrics && (
          <div className="mb-4">
            {summaryMetrics.isFiltered && (
              <div className="flex items-center justify-between mb-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Showing {selectedChannel === "all" ? "Overall" : getChannelName(selectedChannel)} metrics for{" "}
                    {summaryMetrics.date}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setClickedAnnotation(null)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-7"
                >
                  <X className="h-3 w-3 mr-1" />
                  Show All
                </Button>
              </div>
            )}
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {summaryMetrics.isFiltered ? "Impressions" : "Total Impressions"}
                </div>
                <div className="text-lg font-bold text-gray-900">{summaryMetrics.impressions.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {summaryMetrics.isFiltered ? "ROAS" : "Avg ROAS"}
                </div>
                <div className="text-lg font-bold text-gray-900">{summaryMetrics.roas.toFixed(1)}x</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">Visibility %</div>
                <div className="text-lg font-bold text-gray-900">{summaryMetrics.visibility.toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">Revenue</div>
                <div className="text-lg font-bold text-gray-900">£{(summaryMetrics.revenue / 1000).toFixed(1)}k</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">Clicks</div>
                <div className="text-lg font-bold text-gray-900">{summaryMetrics.clicks.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {showAIInsights && aiInsights.length > 0 && (
          <div className="space-y-3 mb-4">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                onClick={() => {
                  if (insight.actionType && onInsightAction) {
                    console.log("[v0] AI Summary clicked, triggering action:", insight.actionType)
                    onInsightAction(insight.actionType)
                  } else if (insight.targetChannel) {
                    handleInsightClick(insight)
                  }
                }}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  insight.targetChannel || insight.actionType
                    ? "cursor-pointer hover:shadow-md hover:border-blue-300"
                    : "",
                  clickedInsight === insight ? "ring-2 ring-blue-500 border-blue-500" : "border-blue-200",
                  "bg-blue-50",
                )}
                style={{
                  backgroundColor: "rgba(239, 246, 255, 0.6)",
                }}
              >
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-semibold text-blue-900">
                      {insight.metric}
                      {insight.changePercent !== 0 && insight.metric !== "AI Summary (Last 30 Days)" && (
                        <span className={insight.changePercent > 0 ? "text-green-600" : "text-red-600"}>
                          {" "}
                          {insight.changePercent > 0 ? "+" : ""}
                          {insight.changePercent.toFixed(0)}%
                        </span>
                      )}
                      {insight.firstDetected && (
                        <span className="text-gray-500 font-normal ml-2">since {insight.firstDetected}</span>
                      )}
                    </div>
                    <p className="text-sm text-blue-700">{insight.cause}</p>
                    <p className="text-sm text-blue-800 font-medium">{insight.action}</p>
                    {insight.trend && <p className="text-xs text-blue-600 italic">{insight.trend}</p>}
                    {(insight.targetChannel || insight.actionType) && (
                      <p className="text-xs text-blue-500 mt-1">
                        {insight.actionType ? "Click to view affected products →" : "Click to view detailed metrics →"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {insightConfig &&
          insightConfig.channel === "google" &&
          selectedChannel === "google" && // Added this condition
          insightConfig.metrics.includes("impressions") && (
            <div className="mt-2 px-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Event marker on day 19: Image quality issue detected</span>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  )
}

export { ProductTrendGraph }
