"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Save, Plus, Target, MessageSquare, Sparkles, Filter, Lock } from "lucide-react"
import type { Product } from "@/types/product"

interface SegmentFilter {
  id: string
  category:
    | "feed"
    | "ads"
    | "onsite"
    | "performance"
    | "search"
    | "aicommerce"
    | "aiDiagnostics"
    | "channel"
    | "dateRange" // Added new categories
  field: string
  label: string
  type: "text" | "enum" | "numeric"
  operator: string
  value: string | string[]
  options?: string[]
}

interface SegmentBuilderProps {
  products: Product[]
  onSegmentSaved: (segment: SavedSegment) => void
  onLoadProducts?: (segment: SavedSegment) => void
  onClearFilters?: () => void
  initialSegment?: SavedSegment | null
}

interface SavedSegment {
  id: string
  name: string
  description: string
  filters: SegmentFilter[]
  timeRange: string
  createdAt: string
  productCount: number
}

// AI-powered question prompts that lead to filter creation
const aiQuestionPrompts = [
  {
    id: "visibility_impact",
    question: "Do you want to see products impacting visibility the most?",
    description: "Products with low visibility scores that need immediate attention",
    icon: "👁️",
    prompt: "Show me products with visibility score below 50 that have high impressions",
  },
  {
    id: "cpc_increase",
    question: "Do you want to see products that have increased in CPC?",
    description: "Products where cost-per-click is above average and hurting profitability",
    icon: "📈",
    prompt: "Find products with CPC above $0.60 and low conversion rates",
  },
  {
    id: "revenue_opportunity",
    question: "Want to find your biggest revenue opportunities?",
    description: "High-performing products that could generate more revenue",
    icon: "💰",
    prompt: "Show me products with high ROAS above 4 but low impressions under 20000",
  },
  {
    id: "stock_risk",
    question: "Are you worried about products going out of stock?",
    description: "Popular products with low inventory levels",
    icon: "⚠️",
    prompt: "Find products with high impressions above 25000 but low stock under 100",
  },
  {
    id: "conversion_issues",
    question: "Want to see products with conversion problems?",
    description: "Products getting clicks but not converting well",
    icon: "🎯",
    prompt: "Show me products with high CTR above 6% but low conversion rate under 5%",
  },
  {
    id: "premium_underperform",
    question: "Are your premium products underperforming?",
    description: "High-priced products not getting the visibility they deserve",
    icon: "💎",
    prompt: "Find products priced above $150 with visibility score below 70",
  },
  {
    id: "bounce_traffic",
    question: "Want to see products losing customers quickly?",
    description: "Products with good traffic but high bounce rates",
    icon: "🔄",
    prompt: "Show me products with impressions above 15000 but bounce rate above 35%",
  },
  {
    id: "return_issues",
    question: "Concerned about products with high return rates?",
    description: "Budget products that customers are returning frequently",
    icon: "📦",
    prompt: "Find products under $50 with return rate above 5%",
  },
  {
    id: "seasonal_winners",
    question: "Want to capitalize on seasonal trends?",
    description: "Winter products performing well that you can push more",
    icon: "❄️",
    prompt: "Show me winter products with ROAS above 3.5",
  },
  {
    id: "approval_bottleneck",
    question: "Are valuable products stuck in approval?",
    description: "High-value products waiting for approval",
    icon: "⏳",
    prompt: "Find products above $100 with pending approval status",
  },
  {
    id: "nike_optimization",
    question: "Want to optimize your Nike product performance?",
    description: "Nike products with room for improvement",
    icon: "✅",
    prompt: "Show me Nike products with visibility score below 80",
  },
  {
    id: "zero_impression",
    question: "Worried about products getting no visibility?",
    description: "Products that aren't showing up in searches at all",
    icon: "🚫",
    prompt: "Find me products with zero impressions in the last 30 days",
  },
  // New Algolia Search Intelligence prompts
  {
    id: "search_demand_low_ads",
    question: "Products with high search demand but low ad visibility?",
    description: "Products customers search for but aren't promoted in ads",
    icon: "🔍",
    prompt: "Show me products with search impressions above 50000 but ad impressions below 20000",
  },
  {
    id: "search_clicks_not_converting",
    question: "Products clicked in search but not converting?",
    description: "Products that attract search clicks but fail to convert",
    icon: "🛒",
    prompt: "Show me products with search clicks above 3000 but search conversion rate below 1%",
  },
  {
    id: "search_add_to_cart_drop",
    question: "Products added to cart from search but not purchased?",
    description: "Products with high cart abandonment from search traffic",
    icon: "🛍️",
    prompt: "Show me products with high search add-to-carts but low search purchases",
  },
]

// Available attributes organized by category
const attributeOptions = {
  feed: {
    label: "Product Attributes",
    color: "bg-blue-50 border-blue-200",
    fields: {
      brand: { label: "Brand", type: "enum", options: ["Nike", "Adidas", "Apple", "Samsung", "Sony"] },
      category: { label: "Category", type: "text" },
      color: { label: "Color", type: "enum", options: ["Black", "White", "Red", "Blue", "Green", "Gray", "Brown"] },
      size: { label: "Size", type: "text" },
      material: { label: "Material", type: "text" },
      price: { label: "Price", type: "numeric" },
      availability: { label: "Stock Status", type: "enum", options: ["in_stock", "out_of_stock", "preorder"] },
      condition: { label: "Condition", type: "enum", options: ["new", "used", "refurbished"] },
      inventoryLevel: { label: "Stock Level", type: "numeric" },
      season: { label: "Season", type: "enum", options: ["Spring", "Summer", "Fall", "Winter", "All Season"] },
      approvalStatus: { label: "Approval Status", type: "enum", options: ["approved", "pending", "disapproved"] },
      imageQuality: { label: "Image Quality", type: "enum", options: ["high", "low", "blurry"] },
    },
  },
  ads: {
    label: "Google Ads Performance",
    color: "bg-green-50 border-green-200",
    fields: {
      impressions: { label: "Impressions", type: "numeric" },
      clicks: { label: "Clicks", type: "numeric" },
      ctr: { label: "Click-Through Rate (%)", type: "numeric" },
      cpc: { label: "Cost Per Click", type: "numeric" },
      conversions: { label: "Conversions", type: "numeric" },
      roas: { label: "Return on Ad Spend", type: "numeric" },
      conversionRate: { label: "Conversion Rate (%)", type: "numeric" },
      visibilityScore: { label: "Visibility Score", type: "numeric" },
    },
  },
  onsite: {
    label: "Website Performance",
    color: "bg-purple-50 border-purple-200",
    fields: {
      revenue: { label: "Revenue", type: "numeric" },
      bounceRate: { label: "Bounce Rate (%)", type: "numeric" },
      returnRate: { label: "Return Rate (%)", type: "numeric" },
      sessions: { label: "Product Page Sessions", type: "numeric" },
      pageviews: { label: "Product Page Views", type: "numeric" },
      addToCart: { label: "Add to Cart Events", type: "numeric" },
    },
  },
  performance: {
    label: "Performance Drivers",
    color: "bg-orange-50 border-orange-200",
    fields: {
      impressionChange: { label: "Impression Change %", type: "numeric" },
      clickChange: { label: "Click Change %", type: "numeric" },
      changePercent: { label: "Change (%)", type: "numeric" },
      direction: { label: "Direction", type: "enum", options: ["Increase", "Decrease", "Stable"] },
      causeDriver: {
        label: "Cause / Driver",
        type: "enum",
        options: [
          "Feed Disapprovals",
          "Missing GTINs",
          "Budget Change",
          "Price Increase",
          "Feed Delay",
          "Low Relevance",
          "Product Removal",
          "Conversion Lag",
        ],
      },
      channelImpact: {
        label: "Channel Impact",
        type: "enum",
        options: ["Google Shopping", "Meta", "TikTok", "Pinterest", "Agentic commerce"],
      },
    },
  },
  aiDiagnostics: {
    label: "AI Diagnostics",
    color: "bg-red-50 border-red-200",
    fields: {
      causeDetected: {
        label: "Cause Detected",
        type: "enum",
        options: ["Feed issue (image quality)", "Budget issue", "Competition", "Seasonality"],
      },
    },
  },
  channel: {
    label: "Channel",
    color: "bg-indigo-50 border-indigo-200",
    fields: {
      feedSource: {
        label: "Source Channel",
        type: "enum",
        options: ["Google Shopping", "Meta", "TikTok", "Pinterest", "Amazon"],
      },
    },
  },
  dateRange: {
    label: "Date Range",
    color: "bg-gray-50 border-gray-200",
    fields: {
      changePeriod: {
        label: "Change Period",
        type: "enum",
        options: ["Last 7 days", "Last 30 days vs previous 30", "Last 90 days"],
      },
    },
  },
  aicommerce: {
    label: "AI Commerce Metrics",
    color: "bg-cyan-50 border-cyan-200",
    fields: {
      enable_search: {
        label: "enable_search",
        type: "enum",
        options: ["yes", "no"],
      },
      enable_checkout: {
        label: "enable_checkout",
        type: "enum",
        options: ["yes", "no"],
      },
    },
  },
  // New Algolia Search Intelligence category
  search: {
    label: "Search Intelligence",
    color: "bg-gray-50 border-gray-300",
    premium: true,
    fields: {
      searchImpressions: { label: "Search Impressions", type: "numeric" },
      searchClicks: { label: "Search Clicks", type: "numeric" },
      searchCtr: { label: "Search CTR (%)", type: "numeric" },
      searchAddToCarts: { label: "Search Add to Carts", type: "numeric" },
      searchPurchases: { label: "Search Purchases", type: "numeric" },
      searchConversionRate: { label: "Search Conversion Rate (%)", type: "numeric" },
      topSearchTerms: { label: "Top Search Terms", type: "text" },
    },
  },
}

// Operators by field type
const operatorsByType = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "not_contains", label: "Does not contain" },
  ],
  enum: [
    { value: "is", label: "Is" },
    { value: "is_not", label: "Is not" },
    { value: "in", label: "Is any of" },
  ],
  numeric: [
    { value: "equals", label: "=" },
    { value: "greater_than", label: ">" },
    { value: "less_than", label: "<" },
    { value: "greater_equal", label: "≥" },
    { value: "less_equal", label: "≤" },
    { value: "between", label: "Between" },
  ],
}

const availableFields = [
  { key: "brand", label: "Brand", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "price", label: "Price", type: "numeric" },
  { key: "visibilityScore", label: "Visibility Score", type: "numeric" },
  { key: "impressions", label: "Impressions", type: "numeric" },
  { key: "clicks", label: "Clicks", type: "numeric" },
  { key: "conversions", label: "Conversions", type: "numeric" },
  { key: "approvalStatus", label: "Approval Status", type: "select" },
  { key: "inventoryLevel", label: "Inventory Level", type: "numeric" },
]

const operators = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "not_contains", label: "Does not contain" },
  ],
  numeric: [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "between", label: "Between" },
  ],
  select: [
    { value: "is", label: "Is" },
    { value: "is_not", label: "Is not" },
    { value: "in", label: "In" },
  ],
}

export function SegmentBuilder({
  products,
  onSegmentSaved,
  onLoadProducts,
  onClearFilters,
  initialSegment,
}: SegmentBuilderProps) {
  const [segmentName, setSegmentName] = useState(initialSegment?.name || "")
  const [segmentDescription, setSegmentDescription] = useState(initialSegment?.description || "")
  const [timeRange, setTimeRange] = useState(initialSegment?.timeRange || "30")
  const [filters, setFilters] = useState<SegmentFilter[]>(initialSegment?.filters || [])
  const [matchingCount, setMatchingCount] = useState(0)
  const [aiQuery, setAiQuery] = useState("")
  const [lastAiPrompt, setLastAiPrompt] = useState("")
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  // Update when initialSegment changes
  useEffect(() => {
    if (initialSegment) {
      setSegmentName(initialSegment.name)
      setSegmentDescription(initialSegment.description)
      setTimeRange(initialSegment.timeRange)
      setFilters(initialSegment.filters || [])
    }
  }, [initialSegment])

  // Calculate matching products count
  useEffect(() => {
    if (filters.length === 0) {
      setMatchingCount(products.length)
      return
    }

    const filtered = products.filter((product) => {
      return filters.every((filter) => {
        const productValue = getProductValue(product, filter.field)
        return evaluateFilter(productValue, filter.operator, filter.value, filter.type)
      })
    })

    setMatchingCount(filtered.length)
  }, [products, filters])

  const getProductValue = (product: Product, field: string): any => {
    const fieldMapping: Record<string, keyof Product | string> = {
      brand: "brand",
      category: "category",
      color: "color",
      size: "size",
      material: "material",
      price: "price",
      availability: "availability",
      condition: "condition",
      inventoryLevel: "inventoryLevel",
      impressions: "impressions",
      clicks: "clicks",
      ctr: "ctr",
      cpc: "cpc",
      conversions: "conversions",
      roas: "roas",
      conversionRate: "conversionRate",
      revenue: "revenue",
      bounceRate: "bounceRate",
      returnRate: "returnRate",
      visibilityScore: "visibilityScore",
      approvalStatus: "approvalStatus",
      // Algolia Search Intelligence fields
      searchImpressions: "searchImpressions",
      searchClicks: "searchClicks",
      searchCtr: "searchCtr",
      searchAddToCarts: "searchAddToCarts",
      searchPurchases: "searchPurchases",
      searchConversionRate: "searchConversionRate",
      topSearchTerms: "topSearchTerms",
      // Performance Drivers fields
      changePercent: "changePercent",
      impressionChange: "impressionChange", // Added
      clickChange: "clickChange", // Added
      direction: "direction",
      causeDriver: "causeDriver",
      channelImpact: "channelImpact",
      // AI Commerce fields
      enable_search: "enable_search",
      enable_checkout: "enable_checkout",
      // AI Diagnostics fields
      causeDetected: "causeDetected", // Added
      // Channel fields
      feedSource: "feedSource", // Added
      // Date Range fields
      changePeriod: "changePeriod", // Added
      imageQuality: "imageQuality",
    }

    const productField = fieldMapping[field]
    if (typeof productField === "string" && productField in product) {
      // Special handling for topSearchTerms array
      if (field === "topSearchTerms" && Array.isArray(product[productField as keyof Product])) {
        return (product[productField as keyof Product] as string[]).join(", ")
      }
      return product[productField as keyof Product]
    }

    // Handle season field by checking customLabels
    if (field === "season") {
      const labels = product.customLabels || []
      if (labels.includes("Winter")) return "Winter"
      if (labels.includes("Summer")) return "Summer"
      if (labels.includes("Spring")) return "Spring"
      if (labels.includes("Fall")) return "Fall"
      return "All Season"
    }

    // Simulate additional metrics
    switch (field) {
      case "sessions":
        return Math.floor(product.impressions * 0.1)
      case "pageviews":
        return Math.floor(product.impressions * 0.12)
      case "addToCart":
        return Math.floor(product.conversions * 1.5)
      default:
        return ""
    }
  }

  const evaluateFilter = (
    productValue: any,
    operator: string,
    filterValue: string | string[],
    type: string,
  ): boolean => {
    switch (operator) {
      case "contains":
        return String(productValue).toLowerCase().includes(String(filterValue).toLowerCase())
      case "equals":
        return String(productValue).toLowerCase() === String(filterValue).toLowerCase()
      case "not_contains":
        return !String(productValue).toLowerCase().includes(String(filterValue).toLowerCase())
      case "is":
        return productValue === filterValue
      case "is_not":
        return productValue !== filterValue
      case "in":
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(productValue))
        }
        return String(filterValue)
          .split(",")
          .map((v) => v.trim())
          .includes(String(productValue))
      case "greater_than":
        return Number(productValue) > Number(filterValue)
      case "less_than":
        return Number(productValue) < Number(filterValue)
      case "greater_equal":
        return Number(productValue) >= Number(filterValue)
      case "less_equal":
        return Number(productValue) <= Number(filterValue)
      case "between":
        if (Array.isArray(filterValue) && filterValue.length === 2) {
          const num = Number(productValue)
          return num >= Number(filterValue[0]) && num <= Number(filterValue[1])
        }
        return false
      default:
        return true
    }
  }

  const addCustomFilter = () => {
    const newFilter: SegmentFilter = {
      id: Math.random().toString(36).substr(2, 9),
      category: "feed", // Default category
      field: "",
      label: "",
      type: "text", // Default type
      operator: "",
      value: "",
    }
    setFilters((prev) => [...prev, newFilter])
  }

  const addFilterAfter = (afterIndex: number) => {
    const newFilter: SegmentFilter = {
      id: Math.random().toString(36).substr(2, 9),
      category: "feed", // Default category
      field: "",
      label: "",
      type: "text", // Default type
      operator: "",
      value: "",
    }
    setFilters((prev) => {
      const newFilters = [...prev]
      newFilters.splice(afterIndex + 1, 0, newFilter)
      return newFilters
    })
  }

  const updateFilter = (id: string, updates: Partial<SegmentFilter>) => {
    setFilters((prev) => prev.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)))
  }

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id))
  }

  const saveSegment = () => {
    if (!segmentName.trim()) return

    const segment: SavedSegment = {
      id: Math.random().toString(36).substr(2, 9),
      name: segmentName,
      description: segmentDescription,
      filters,
      timeRange,
      createdAt: new Date().toISOString(),
      productCount: matchingCount,
    }

    onSegmentSaved(segment)
    if (onLoadProducts) {
      onLoadProducts(segment)
    }
  }

  const loadProducts = () => {
    const segment: SavedSegment = {
      id: Math.random().toString(36).substr(2, 9),
      name: segmentName || `Filter ${new Date().toLocaleTimeString()}`,
      description: segmentDescription,
      filters,
      timeRange,
      createdAt: new Date().toISOString(),
      productCount: matchingCount,
    }

    if (onLoadProducts) {
      onLoadProducts(segment)
    }
  }

  const clearFilters = () => {
    console.log("[v0] clearFilters called in segment-builder")
    setFilters([])
    setSegmentName("")
    setSegmentDescription("")
    setLastAiPrompt("")
    setAiQuery("")

    // Call the parent's clear handler to show random products
    if (onClearFilters) {
      console.log("[v0] Calling onClearFilters callback")
      onClearFilters()
    } else {
      console.log("[v0] No onClearFilters callback provided")
    }
  }

  // Enhanced AI query handler that creates filters based on prompts
  const handleAiQuery = (promptText?: string) => {
    const queryToProcess = promptText || aiQuery
    if (!queryToProcess.trim()) return

    // Clear existing filters first
    setFilters([])

    // Create filters based on AI query
    const query = queryToProcess.toLowerCase()
    const newFilters: SegmentFilter[] = []

    // Enhanced AI logic for different scenarios
    if (query.includes("visibility score below") && query.includes("high impressions")) {
      const threshold = query.match(/below (\d+)/) ? query.match(/below (\d+)/)?.[1] || "50" : "50"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "visibilityScore",
        label: "Visibility Score",
        type: "numeric",
        operator: "less_than",
        value: threshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "greater_than",
        value: "15000",
      })
    } else if (query.includes("cpc above") && query.includes("low conversion")) {
      const cpcMatch = query.match(/cpc above \$?(\d+\.?\d*)/)
      const cpcThreshold = cpcMatch ? cpcMatch[1] : "0.60"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "cpc",
        label: "Cost Per Click",
        type: "numeric",
        operator: "greater_than",
        value: cpcThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "conversionRate",
        label: "Conversion Rate (%)",
        type: "numeric",
        operator: "less_than",
        value: "5",
      })
    } else if (query.includes("high roas") && query.includes("low impressions")) {
      const roasMatch = query.match(/roas above (\d+\.?\d*)/)
      const roasThreshold = roasMatch ? roasMatch[1] : "4"
      const impressionMatch = query.match(/impressions under (\d+)/)
      const impressionThreshold = impressionMatch ? impressionMatch[1] : "20000"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "roas",
        label: "Return on Ad Spend",
        type: "numeric",
        operator: "greater_than",
        value: roasThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "less_than",
        value: impressionThreshold,
      })
    } else if (query.includes("high impressions") && query.includes("low stock")) {
      const impressionMatch = query.match(/impressions above (\d+)/)
      const impressionThreshold = impressionMatch ? impressionMatch[1] : "25000"
      const stockMatch = query.match(/stock under (\d+)/)
      const stockThreshold = stockMatch ? stockMatch[1] : "100"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "greater_than",
        value: impressionThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "inventoryLevel",
        label: "Stock Level",
        type: "numeric",
        operator: "less_than",
        value: stockThreshold,
      })
    } else if (query.includes("high ctr") && query.includes("low conversion")) {
      const ctrMatch = query.match(/ctr above (\d+\.?\d*)%?/)
      const ctrThreshold = ctrMatch ? ctrMatch[1] : "6"
      const conversionMatch = query.match(/conversion rate under (\d+\.?\d*)%?/)
      const conversionThreshold = conversionMatch ? conversionMatch[1] : "5"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "ctr",
        label: "Click-Through Rate (%)",
        type: "numeric",
        operator: "greater_than",
        value: ctrThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "conversionRate",
        label: "Conversion Rate (%)",
        type: "numeric",
        operator: "less_than",
        value: conversionThreshold,
      })
    } else if (query.includes("priced above") && query.includes("visibility score below")) {
      const priceMatch = query.match(/priced above \$?(\d+)/)
      const priceThreshold = priceMatch ? priceMatch[1] : "150"
      const visibilityMatch = query.match(/visibility score below (\d+)/)
      const visibilityThreshold = visibilityMatch ? visibilityMatch[1] : "70"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "price",
        label: "Price",
        type: "numeric",
        operator: "greater_than",
        value: priceThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "visibilityScore",
        label: "Visibility Score",
        type: "numeric",
        operator: "less_than",
        value: visibilityThreshold,
      })
    } else if (query.includes("impressions above") && query.includes("bounce rate above")) {
      const impressionMatch = query.match(/impressions above (\d+)/)
      const impressionThreshold = impressionMatch ? impressionMatch[1] : "15000"
      const bounceMatch = query.match(/bounce rate above (\d+\.?\d*)%?/)
      const bounceThreshold = bounceMatch ? bounceMatch[1] : "35"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "greater_than",
        value: impressionThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "onsite",
        field: "bounceRate",
        label: "Bounce Rate (%)",
        type: "numeric",
        operator: "greater_than",
        value: bounceThreshold,
      })
    } else if (query.includes("under $") && query.includes("return rate above")) {
      const priceMatch = query.match(/under \$(\d+)/)
      const priceThreshold = priceMatch ? priceMatch[1] : "50"
      const returnMatch = query.match(/return rate above (\d+\.?\d*)%?/)
      const returnThreshold = returnMatch ? returnMatch[1] : "5"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "price",
        label: "Price",
        type: "numeric",
        operator: "less_than",
        value: priceThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "onsite",
        field: "returnRate",
        label: "Return Rate (%)",
        type: "numeric",
        operator: "greater_than",
        value: returnThreshold,
      })
    } else if (query.includes("winter products") && query.includes("roas above")) {
      const roasMatch = query.match(/roas above (\d+\.?\d*)/)
      const roasThreshold = roasMatch ? roasMatch[1] : "3.5"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "season",
        label: "Season",
        type: "enum",
        operator: "is",
        value: "Winter",
        options: ["Spring", "Summer", "Fall", "Winter", "All Season"],
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "roas",
        label: "Return on Ad Spend",
        type: "numeric",
        operator: "greater_than",
        value: roasThreshold,
      })
    } else if (query.includes("above $") && query.includes("pending approval")) {
      const priceMatch = query.match(/above \$(\d+)/)
      const priceThreshold = priceMatch ? priceMatch[1] : "100"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "price",
        label: "Price",
        type: "numeric",
        operator: "greater_than",
        value: priceThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "approvalStatus",
        label: "Approval Status",
        type: "enum",
        operator: "is",
        value: "pending",
        options: ["approved", "pending", "disapproved"],
      })
    } else if (query.includes("nike products") && query.includes("visibility score below")) {
      const visibilityMatch = query.match(/visibility score below (\d+)/)
      const visibilityThreshold = visibilityMatch ? visibilityMatch[1] : "80"
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "feed",
        field: "brand",
        label: "Brand",
        type: "enum",
        operator: "is",
        value: "Nike",
        options: ["Nike", "Adidas", "Apple", "Samsung", "Sony"],
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "visibilityScore",
        label: "Visibility Score",
        type: "numeric",
        operator: "less_than",
        value: visibilityThreshold,
      })
    } else if (query.includes("zero impressions")) {
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "equals",
        value: "0",
      })
    }
    // New Algolia Search Intelligence filters
    else if (query.includes("search impressions above") && query.includes("ad impressions below")) {
      const searchImpMatch = query.match(/search impressions above (\d+)/)
      const searchImpThreshold = searchImpMatch ? searchImpMatch[1] : "50000"
      const adImpMatch = query.match(/ad impressions below (\d+)/)
      const adImpThreshold = adImpMatch ? adImpMatch[1] : "20000"

      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "search",
        field: "searchImpressions",
        label: "Search Impressions",
        type: "numeric",
        operator: "greater_than",
        value: searchImpThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "ads",
        field: "impressions",
        label: "Impressions",
        type: "numeric",
        operator: "less_than",
        value: adImpThreshold,
      })
    } else if (query.includes("search clicks above") && query.includes("search conversion rate below")) {
      const searchClicksMatch = query.match(/search clicks above (\d+)/)
      const searchClicksThreshold = searchClicksMatch ? searchClicksMatch[1] : "3000"
      const searchConvMatch = query.match(/search conversion rate below (\d+\.?\d*)%?/)
      const searchConvThreshold = searchConvMatch ? searchConvMatch[1] : "1"

      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "search",
        field: "searchClicks",
        label: "Search Clicks",
        type: "numeric",
        operator: "greater_than",
        value: searchClicksThreshold,
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "search",
        field: "searchConversionRate",
        label: "Search Conversion Rate (%)",
        type: "numeric",
        operator: "less_than",
        value: searchConvThreshold,
      })
    } else if (query.includes("high search add-to-carts") && query.includes("low search purchases")) {
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "search",
        field: "searchAddToCarts",
        label: "Search Add to Carts",
        type: "numeric",
        operator: "greater_than",
        value: "1000",
      })
      newFilters.push({
        id: Math.random().toString(36).substr(2, 9),
        category: "search",
        field: "searchPurchases",
        label: "Search Purchases",
        type: "numeric",
        operator: "less_than",
        value: "100",
      })
    }

    // Set the new filters
    setFilters(newFilters)

    // Auto-populate segment name if empty
    if (!segmentName && newFilters.length > 0) {
      // Create a more descriptive name based on the prompt
      let autoName = ""
      if (query.includes("visibility")) autoName = "Low Visibility Products"
      else if (query.includes("cpc")) autoName = "High CPC Products"
      else if (query.includes("revenue opportunity")) autoName = "Revenue Opportunities"
      else if (query.includes("stock")) autoName = "Stock Risk Products"
      else if (query.includes("conversion")) autoName = "Conversion Issues"
      else if (query.includes("premium")) autoName = "Premium Underperformers"
      else if (query.includes("bounce")) autoName = "High Bounce Products"
      else if (query.includes("return")) autoName = "High Return Products"
      else if (query.includes("winter")) autoName = "Winter Winners"
      else if (query.includes("approval")) autoName = "Approval Bottleneck"
      else if (query.includes("nike")) autoName = "Nike Optimization"
      else if (query.includes("zero")) autoName = "Zero Impression Products"
      // New Algolia Search Intelligence names
      else if (query.includes("search impressions") && query.includes("ad impressions"))
        autoName = "High Search Demand, Low Ad Visibility"
      else if (query.includes("search clicks") && query.includes("search conversion"))
        autoName = "Search Clicks Not Converting"
      else if (query.includes("search add-to-carts") && query.includes("search purchases"))
        autoName = "Search Cart Abandonment"
      else autoName = "AI Generated Segment"

      setSegmentName(autoName)
      setSegmentDescription(`AI-generated segment: ${queryToProcess}`)
    }

    // Store the last AI prompt for reference
    setLastAiPrompt(queryToProcess)

    // Clear the query after processing
    setAiQuery("")
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>AI-Powered Segment Builder</CardTitle>
          <CardDescription>
            Start with AI-powered questions to identify optimization opportunities, then refine with manual filters
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Segment Details - Condensed */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="segment-name">Segment Name *</Label>
            <Input
              id="segment-name"
              placeholder="e.g., Low Visibility Products"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segment-description">Description</Label>
            <Input
              id="segment-description"
              placeholder="Brief description"
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-range">Data Period</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{matchingCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">products match</div>
            </div>
          </div>
        </div>

        {/* AI Question Prompts - PRIMARY INTERFACE */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <Label className="text-base font-medium">What would you like to discover?</Label>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {aiQuestionPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50"
                onClick={() => handleAiQuery(prompt.prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{prompt.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{prompt.question}</h4>
                      <p className="text-xs text-gray-600">{prompt.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom AI Query */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <Label className="text-sm font-medium">Or ask your own question:</Label>
            </div>
            <div className="flex space-x-2">
              <Textarea
                placeholder="e.g., 'Show me Adidas products with high return rates' or 'Find products above $200 with low clicks'"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-white"
                rows={2}
              />
              <Button onClick={() => handleAiQuery()} className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Show AI Logic Applied */}
        {lastAiPrompt && filters.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-green-800">AI Logic Applied:</div>
                <div className="text-sm text-green-700 italic">"{lastAiPrompt}"</div>
                <div className="text-xs text-green-600 mt-1">
                  The filters below show the logic AI used. You can modify, add, or remove filters as needed.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters - Manual Refinement */}
        {filters.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">AI-Generated Filters ({filters.length}) - Refine as needed:</Label>
              <Button variant="outline" size="sm" onClick={addCustomFilter}>
                <Plus className="h-3 w-3 mr-1" />
                Add Filter
              </Button>
            </div>
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <div key={filter.id}>
                  {index > 0 && (
                    <div className="flex justify-center my-2">
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-white">
                        AND
                      </Badge>
                    </div>
                  )}
                  <CompactFilterBuilder
                    filter={filter}
                    index={index}
                    onUpdate={(updates) => updateFilter(filter.id, updates)}
                    onRemove={() => removeFilter(filter.id)}
                    onAddAfter={() => addFilterAfter(index)}
                    onShowUpgrade={() => setShowUpgradeDialog(true)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {filters.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No filters added yet</p>
            <p className="text-sm">Click "Add Filter" to start building your segment</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              onClick={loadProducts}
              disabled={filters.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Target className="h-4 w-4 mr-2" />
              Load Products ({matchingCount})
            </Button>

            <Button onClick={clearFilters} variant="outline" className="px-6 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Clear Grid
            </Button>
          </div>

          <Button onClick={saveSegment} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            <Save className="h-4 w-4 mr-2" />
            {initialSegment ? "Update Segment" : "Save & Apply Segment"}
          </Button>
        </div>
      </CardContent>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-orange-500" />
              <span>Search Intelligence Premium Feature</span>
            </DialogTitle>
            <DialogDescription>
              Search Intelligence data requires the Search Optimizer upgrade package. Contact your Customer Success
              Manager to unlock these advanced analytics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">Unlock Search Intelligence:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Search impression tracking</li>
                <li>• Search click-through rates</li>
                <li>• Search conversion analytics</li>
                <li>• Top search terms analysis</li>
                <li>• Search-to-purchase funnel data</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Continue Demo
              </Button>
              <Button
                onClick={() => {
                  alert("Contact your CSM at csm@company.com to upgrade to Search Optimizer")
                  setShowUpgradeDialog(false)
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Contact CSM
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Compact Filter Builder Component
interface CompactFilterBuilderProps {
  filter: SegmentFilter
  index: number
  onUpdate: (updates: Partial<SegmentFilter>) => void
  onRemove: () => void
  onAddAfter: () => void
  onShowUpgrade: () => void
}

function CompactFilterBuilder({
  filter,
  index,
  onUpdate,
  onRemove,
  onAddAfter,
  onShowUpgrade,
}: CompactFilterBuilderProps) {
  const getFieldOptions = (category: string) => {
    return attributeOptions[category as keyof typeof attributeOptions]?.fields || {}
  }

  const getOperators = (type: string) => {
    return operatorsByType[type as keyof typeof operatorsByType] || operatorsByType.text
  }

  const handleCategoryChange = (
    value:
      | "feed"
      | "ads"
      | "onsite"
      | "performance"
      | "search"
      | "aicommerce"
      | "aiDiagnostics"
      | "channel"
      | "dateRange",
  ) => {
    // Show upgrade dialog if selecting Search Intelligence
    if (value === "search") {
      onShowUpgrade()
    }
    // Reset field, operator, and value when category changes
    onUpdate({ category: value, field: "", label: "", operator: "", value: "" })
  }

  const handleFieldChange = (field: string) => {
    const fieldOptions = getFieldOptions(filter.category)
    const fieldDef = fieldOptions[field as keyof typeof fieldOptions]

    if (fieldDef) {
      onUpdate({
        field,
        label: fieldDef.label,
        type: fieldDef.type as "text" | "enum" | "numeric",
        options: fieldDef.options,
        operator: "", // Reset operator
        value: "", // Reset value
      })
    }
  }

  const renderValueInput = () => {
    if (filter.operator === "between") {
      const values = Array.isArray(filter.value) ? filter.value : ["", ""]
      return (
        <div className="flex items-center space-x-1">
          <Input
            placeholder="Min"
            value={values[0] || ""}
            onChange={(e) =>
              onUpdate({
                value: [e.target.value, values[1] || ""],
              })
            }
            className="w-16 h-8 text-xs"
            type="number"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            placeholder="Max"
            value={values[1] || ""}
            onChange={(e) =>
              onUpdate({
                value: [values[0] || "", e.target.value],
              })
            }
            className="w-16 h-8 text-xs"
            type="number"
          />
        </div>
      )
    }

    if (filter.type === "enum" && filter.options) {
      return (
        <Select value={String(filter.value)} onValueChange={(value) => onUpdate({ value })}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        placeholder="Value"
        value={String(filter.value)}
        onChange={(e) => onUpdate({ value: e.target.value })}
        className="w-24 h-8 text-xs"
        type={filter.type === "numeric" ? "number" : "text"}
      />
    )
  }

  const categoryConfig = attributeOptions[filter.category]
  const isPremium = categoryConfig?.premium

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${categoryConfig?.color || "bg-gray-50 border-gray-200"} ${isPremium ? "opacity-75" : ""}`}
    >
      {/* Category Dropdown */}
      <Select value={filter.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue placeholder="Data Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="feed">Product Attributes</SelectItem>
          <SelectItem value="ads">Google Ads Metrics</SelectItem>
          <SelectItem value="onsite">On-Site Performance</SelectItem>
          <SelectItem value="performance">Performance Drivers</SelectItem>
          <SelectItem value="aiDiagnostics">AI Diagnostics</SelectItem>
          <SelectItem value="channel">Channel</SelectItem>
          <SelectItem value="dateRange">Date Range</SelectItem>
          <SelectItem value="aicommerce">AI Commerce Metrics</SelectItem>
          <SelectItem value="search" className="text-gray-500">
            <div className="flex items-center justify-between w-full">
              <span>Search Intelligence</span>
              <Lock className="h-3 w-3 text-orange-500 ml-2" />
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Field */}
      <Select value={filter.field} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Attribute" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(getFieldOptions(filter.category)).map(([key, field]) => (
            <SelectItem key={key} value={key}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator */}
      <Select
        value={filter.operator}
        onValueChange={(value) => onUpdate({ operator: value, value: "" })}
        disabled={!filter.field}
      >
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue placeholder="Op" />
        </SelectTrigger>
        <SelectContent>
          {getOperators(filter.type).map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value */}
      {filter.operator && renderValueInput()}

      {/* Premium indicator for Search Intelligence */}
      {isPremium && (
        <div className="flex items-center space-x-1 text-orange-600">
          <Lock className="h-3 w-3" />
          <span className="text-xs font-medium">Premium</span>
        </div>
      )}

      {/* Plus Button - Add Next Condition */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-dashed bg-white hover:bg-gray-50"
        onClick={onAddAfter}
        title="Add another condition"
      >
        <Plus className="h-3 w-3" />
      </Button>

      {/* Remove Button */}
      <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
