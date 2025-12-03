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
  Search,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Eye,
  MousePointer,
  ShoppingCart,
  BarChart3,
  Filter,
  Download,
} from "lucide-react"
import type { Product } from "@/types/product"

interface SearchTermSuggestion {
  id: string
  term: string
  type: "missing_keyword" | "trending_term" | "competitor_term" | "long_tail" | "seasonal" | "brand_variant"
  priority: "high" | "medium" | "low"
  estimatedImpact: number
  searchVolume: number
  competition: "low" | "medium" | "high"
  reason: string
  currentRanking?: number
  targetRanking?: number
  products: string[]
  category: string
  confidence: number
}

interface ImplementedSuggestion {
  suggestionId: string
  implementedDate: string
  status: "active" | "paused" | "removed"
}

interface SearchTermAnalysis {
  productId: string
  productName: string
  currentTerms: string[]
  suggestedTerms: SearchTermSuggestion[]
  searchPerformance: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    conversionRate: number
  }
  opportunities: {
    missingKeywords: number
    lowPerformingTerms: number
    competitorGaps: number
    seasonalOpportunities: number
  }
}

interface SearchTermOptimizerProps {
  products: Product[]
  implementedSuggestions?: ImplementedSuggestion[]
}

// Mock AI-generated search term suggestions
const generateSearchTermSuggestions = (product: Product): SearchTermSuggestion[] => {
  const suggestions: SearchTermSuggestion[] = []

  // Extract product attributes for context
  const brand = product.brand.toLowerCase()
  const category = product.category.toLowerCase()
  const color = product.color?.toLowerCase() || ""
  const size = product.size?.toLowerCase() || ""
  const material = product.material?.toLowerCase() || ""

  // Generate different types of suggestions based on product data

  // Missing Keywords (High Priority)
  if (product.searchImpressions < 30000) {
    suggestions.push({
      id: `missing-${product.id}-1`,
      term: `${brand} ${category.split(" > ").pop()} ${color}`.trim(),
      type: "missing_keyword",
      priority: "high",
      estimatedImpact: 35,
      searchVolume: 12000,
      competition: "medium",
      reason: "High search volume keyword missing from current optimization",
      currentRanking: undefined,
      targetRanking: 15,
      products: [product.id],
      category: product.category,
      confidence: 92,
    })
  }

  // Trending Terms
  if (product.category.includes("Athletic") || product.category.includes("Running")) {
    suggestions.push({
      id: `trending-${product.id}-1`,
      term: `${brand} running shoes 2024`,
      type: "trending_term",
      priority: "high",
      estimatedImpact: 28,
      searchVolume: 8500,
      competition: "high",
      reason: "Trending seasonal keyword with growing search volume",
      currentRanking: undefined,
      targetRanking: 20,
      products: [product.id],
      category: product.category,
      confidence: 87,
    })
  }

  // Long-tail opportunities
  if (color && size) {
    suggestions.push({
      id: `longtail-${product.id}-1`,
      term: `${brand} ${color} ${category.split(" > ").pop()} size ${size}`,
      type: "long_tail",
      priority: "medium",
      estimatedImpact: 18,
      searchVolume: 2400,
      competition: "low",
      reason: "Low competition long-tail keyword with good conversion potential",
      currentRanking: undefined,
      targetRanking: 8,
      products: [product.id],
      category: product.category,
      confidence: 78,
    })
  }

  // Competitor terms
  if (brand === "nike") {
    suggestions.push({
      id: `competitor-${product.id}-1`,
      term: "adidas alternative running shoes",
      type: "competitor_term",
      priority: "medium",
      estimatedImpact: 22,
      searchVolume: 5600,
      competition: "medium",
      reason: "Competitor comparison term with good conversion rates",
      currentRanking: undefined,
      targetRanking: 12,
      products: [product.id],
      category: product.category,
      confidence: 71,
    })
  }

  // Brand variants
  suggestions.push({
    id: `brand-${product.id}-1`,
    term: `${brand} official store`,
    type: "brand_variant",
    priority: "low",
    estimatedImpact: 12,
    searchVolume: 3200,
    competition: "low",
    reason: "Brand authenticity keyword for trust building",
    currentRanking: undefined,
    targetRanking: 5,
    products: [product.id],
    category: product.category,
    confidence: 65,
  })

  // Seasonal opportunities (if winter products)
  if (product.customLabels?.includes("Winter")) {
    suggestions.push({
      id: `seasonal-${product.id}-1`,
      term: `winter ${category.split(" > ").pop()} 2024`,
      type: "seasonal",
      priority: "high",
      estimatedImpact: 42,
      searchVolume: 15000,
      competition: "high",
      reason: "High-impact seasonal keyword with time-sensitive opportunity",
      currentRanking: undefined,
      targetRanking: 18,
      products: [product.id],
      category: product.category,
      confidence: 94,
    })
  }

  return suggestions
}

// Generate analysis for products
const generateSearchTermAnalysis = (products: Product[]): SearchTermAnalysis[] => {
  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    currentTerms: product.topSearchTerms,
    suggestedTerms: generateSearchTermSuggestions(product),
    searchPerformance: {
      impressions: product.searchImpressions,
      clicks: product.searchClicks,
      ctr: product.searchCtr,
      conversions: product.searchPurchases,
      conversionRate: product.searchConversionRate,
    },
    opportunities: {
      missingKeywords: Math.floor(Math.random() * 5) + 2,
      lowPerformingTerms: Math.floor(Math.random() * 3) + 1,
      competitorGaps: Math.floor(Math.random() * 4) + 1,
      seasonalOpportunities: Math.floor(Math.random() * 2) + 1,
    },
  }))
}

export function SearchTermOptimizer({ products, implementedSuggestions = [] }: SearchTermOptimizerProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [analysisData, setAnalysisData] = useState<SearchTermAnalysis[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [optimizationMode, setOptimizationMode] = useState<"individual" | "bulk">("individual")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    // Generate analysis data for products
    const analysis = generateSearchTermAnalysis(products.slice(0, 10)) // Limit for demo
    setAnalysisData(analysis)
    if (analysis.length > 0) {
      setSelectedProduct(analysis[0].productId)
    }
  }, [products])

  const selectedProductAnalysis = analysisData.find((a) => a.productId === selectedProduct)

  // Aggregate all suggestions for bulk view
  const allSuggestions = analysisData.flatMap((analysis) =>
    analysis.suggestedTerms.map((suggestion) => ({
      ...suggestion,
      productName: analysis.productName,
    })),
  )

  // Filter suggestions
  const filteredSuggestions = allSuggestions.filter((suggestion) => {
    if (filterType !== "all" && suggestion.type !== filterType) return false
    if (filterPriority !== "all" && suggestion.priority !== filterPriority) return false
    return true
  })

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestionId) ? prev.filter((id) => id !== suggestionId) : [...prev, suggestionId],
    )
  }

  const applySelectedSuggestions = () => {
    // In a real implementation, this would apply the selected suggestions
    console.log("Applying suggestions:", selectedSuggestions)
    // Reset selection
    setSelectedSuggestions([])
  }

  const getSuggestionTypeIcon = (type: SearchTermSuggestion["type"]) => {
    switch (type) {
      case "missing_keyword":
        return <Target className="h-4 w-4" />
      case "trending_term":
        return <TrendingUp className="h-4 w-4" />
      case "competitor_term":
        return <BarChart3 className="h-4 w-4" />
      case "long_tail":
        return <Search className="h-4 w-4" />
      case "seasonal":
        return <Zap className="h-4 w-4" />
      case "brand_variant":
        return <Eye className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getSuggestionTypeColor = (type: SearchTermSuggestion["type"]) => {
    switch (type) {
      case "missing_keyword":
        return "text-red-600 bg-red-50"
      case "trending_term":
        return "text-green-600 bg-green-50"
      case "competitor_term":
        return "text-blue-600 bg-blue-50"
      case "long_tail":
        return "text-purple-600 bg-purple-50"
      case "seasonal":
        return "text-orange-600 bg-orange-50"
      case "brand_variant":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityBadge = (priority: SearchTermSuggestion["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  const getCompetitionBadge = (competition: SearchTermSuggestion["competition"]) => {
    switch (competition) {
      case "low":
        return <Badge className="bg-green-100 text-green-800 text-xs">Low</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
    }
  }

  const isImplemented = (suggestionId: string) => {
    return implementedSuggestions.some((impl) => impl.suggestionId === suggestionId)
  }

  const getImplementationStatus = (suggestionId: string) => {
    const impl = implementedSuggestions.find((impl) => impl.suggestionId === suggestionId)
    return impl?.status || null
  }

  // Calculate summary metrics
  const totalSuggestions = allSuggestions.length
  const highPrioritySuggestions = allSuggestions.filter((s) => s.priority === "high").length
  const avgEstimatedImpact = Math.round(
    allSuggestions.reduce((sum, s) => sum + s.estimatedImpact, 0) / Math.max(allSuggestions.length, 1),
  )
  const totalSearchVolume = allSuggestions.reduce((sum, s) => sum + s.searchVolume, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Search Term Optimizer</h2>
            <p className="text-muted-foreground">Intelligent keyword suggestions to improve search performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={applySelectedSuggestions}
            disabled={selectedSuggestions.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Apply Selected ({selectedSuggestions.length})
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuggestions}</div>
            <p className="text-xs text-muted-foreground">{highPrioritySuggestions} high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{avgEstimatedImpact}%</div>
            <p className="text-xs text-muted-foreground">estimated improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Volume</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSearchVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">monthly searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Analyzed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.length}</div>
            <p className="text-xs text-muted-foreground">with optimization opportunities</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={optimizationMode} onValueChange={(value: "individual" | "bulk") => setOptimizationMode(value)}>
        <TabsList>
          <TabsTrigger value="individual">Individual Products</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          {/* Product Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Product for Analysis</CardTitle>
              <CardDescription>Choose a product to see AI-powered search term suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {analysisData.map((analysis) => (
                    <SelectItem key={analysis.productId} value={analysis.productId}>
                      <div className="flex items-center space-x-2">
                        <span>{analysis.productName}</span>
                        <Badge variant="outline" className="text-xs">
                          {analysis.suggestedTerms.length} suggestions
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedProductAnalysis && (
            <>
              {/* Current Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Search Performance</CardTitle>
                  <CardDescription>{selectedProductAnalysis.productName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Search Impressions</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedProductAnalysis.searchPerformance.impressions.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Search Clicks</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedProductAnalysis.searchPerformance.clicks.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Search CTR</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedProductAnalysis.searchPerformance.ctr.toFixed(2)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Conversions</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedProductAnalysis.searchPerformance.conversions}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Search Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Search Terms</CardTitle>
                  <CardDescription>Terms currently driving traffic to this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductAnalysis.currentTerms.map((term, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>AI-Powered Suggestions</span>
                  </CardTitle>
                  <CardDescription>Intelligent keyword recommendations based on search data analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedProductAnalysis.suggestedTerms.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                          selectedSuggestions.includes(suggestion.id) ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedSuggestions.includes(suggestion.id)}
                              onChange={() => handleSuggestionToggle(suggestion.id)}
                              className="mt-1"
                            />
                            <div className={`p-2 rounded-lg ${getSuggestionTypeColor(suggestion.type)}`}>
                              {getSuggestionTypeIcon(suggestion.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-lg">"{suggestion.term}"</h4>
                                {getPriorityBadge(suggestion.priority)}
                                {getCompetitionBadge(suggestion.competition)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
                              <div className="grid gap-2 md:grid-cols-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Est. Impact:</span>
                                  <div className="font-medium text-green-600">+{suggestion.estimatedImpact}%</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Search Volume:</span>
                                  <div className="font-medium">{suggestion.searchVolume.toLocaleString()}/mo</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Target Rank:</span>
                                  <div className="font-medium">#{suggestion.targetRanking}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Confidence:</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={suggestion.confidence} className="w-16 h-2" />
                                    <span className="font-medium">{suggestion.confidence}%</span>
                                  </div>
                                </div>
                              </div>
                              {isImplemented(suggestion.id) && (
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      className={
                                        getImplementationStatus(suggestion.id) === "active"
                                          ? "bg-green-100 text-green-800"
                                          : getImplementationStatus(suggestion.id) === "paused"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {getImplementationStatus(suggestion.id)}
                                    </Badge>
                                    <Button variant="outline" size="sm">
                                      View Performance
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Suggestions</CardTitle>
              <CardDescription>Filter suggestions by type and priority across all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <Label>Suggestion Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="missing_keyword">Missing Keywords</SelectItem>
                      <SelectItem value="trending_term">Trending Terms</SelectItem>
                      <SelectItem value="competitor_term">Competitor Terms</SelectItem>
                      <SelectItem value="long_tail">Long-tail Keywords</SelectItem>
                      <SelectItem value="seasonal">Seasonal Terms</SelectItem>
                      <SelectItem value="brand_variant">Brand Variants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Suggestions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Suggestions ({filteredSuggestions.length})</CardTitle>
              <CardDescription>AI-powered keyword suggestions across all analyzed products</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSuggestions(filteredSuggestions.map((s) => s.id))
                          } else {
                            setSelectedSuggestions([])
                          }
                        }}
                        checked={
                          selectedSuggestions.length === filteredSuggestions.length && filteredSuggestions.length > 0
                        }
                      />
                    </TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Competition</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuggestions.map((suggestion) => (
                    <TableRow key={suggestion.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedSuggestions.includes(suggestion.id)}
                          onChange={() => handleSuggestionToggle(suggestion.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">"{suggestion.term}"</div>
                        <div className="text-sm text-muted-foreground">{suggestion.reason}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{suggestion.productName}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center space-x-2 p-2 rounded-lg ${getSuggestionTypeColor(suggestion.type)}`}
                        >
                          {getSuggestionTypeIcon(suggestion.type)}
                          <span className="text-sm capitalize">{suggestion.type.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(suggestion.priority)}</TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">+{suggestion.estimatedImpact}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{suggestion.searchVolume.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>{getCompetitionBadge(suggestion.competition)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={suggestion.confidence} className="w-16 h-2" />
                          <span className="text-sm">{suggestion.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isImplemented(suggestion.id) && (
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                getImplementationStatus(suggestion.id) === "active"
                                  ? "bg-green-100 text-green-800"
                                  : getImplementationStatus(suggestion.id) === "paused"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {getImplementationStatus(suggestion.id)}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Performance
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Implementation Guide</span>
          </CardTitle>
          <CardDescription>How to apply these search term optimizations effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Best Practices</span>
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Start with high-priority, high-confidence suggestions</li>
                <li>• Test seasonal keywords during relevant periods</li>
                <li>• Monitor competitor terms for market opportunities</li>
                <li>• Use long-tail keywords for better conversion rates</li>
                <li>• Regularly update keywords based on performance data</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>Important Notes</span>
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• High competition keywords may require higher bids</li>
                <li>• Monitor search volume trends for seasonal terms</li>
                <li>• Test suggestions gradually to measure impact</li>
                <li>• Consider brand guidelines when using competitor terms</li>
                <li>• Track ranking improvements after implementation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
