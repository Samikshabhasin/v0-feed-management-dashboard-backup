"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Lightbulb,
  Trash2,
  Plus,
  Tag,
  FileText,
  Sparkles,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
} from "lucide-react"

export function OptimizePage() {
  const [selectedSegment, setSelectedSegment] = useState("low-ctr-skus")
  const [selectedAction, setSelectedAction] = useState("ai-recommendation")

  const segmentOptions = [
    { value: "low-ctr-skus", label: "Low CTR SKUs" },
    { value: "high-spend-no-conversions", label: "High Spend, No Conversions" },
    { value: "top-margin-performers", label: "Top Margin Performers" },
    { value: "create-new-segment", label: "Create New Segment" },
  ]

  const actionOptions = [
    {
      id: "ai-recommendation",
      title: "AI Recommendation",
      description: "Let AI choose the best optimization strategy",
      icon: Sparkles,
      isRecommended: true,
    },
    {
      id: "exclude-products",
      title: "Exclude Products",
      description: "Remove underperforming products from feeds",
      icon: Trash2,
    },
    {
      id: "enrich-attributes",
      title: "Enrich Attributes",
      description: "Add missing product attributes and details",
      icon: Plus,
    },
    {
      id: "relabel-products",
      title: "Relabel Products",
      description: "Update product labels and categories",
      icon: Tag,
    },
    {
      id: "rewrite-titles",
      title: "Rewrite Titles",
      description: "Optimize product titles for better performance",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Intelligent Optimisation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Optimising Segment: <span className="font-semibold text-foreground">Low CTR SKUs</span>
        </p>

        {/* Segment Selector */}
        <div className="flex items-center gap-4">
          <Label htmlFor="segment-selector" className="text-sm font-medium">
            Segment:
          </Label>
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {segmentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Suggestion Bar */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-sm font-medium text-blue-900">
                <span className="font-semibold">AI Suggests:</span> Exclude products with CTR &lt;1% and enrich titles
                with trending keywords to boost visibility.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Apply Suggestion
                </Button>
                <Button size="sm" variant="outline">
                  Modify & Test
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-6">What's the Change?</h2>

          <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="space-y-4">
            {actionOptions.map((option) => {
              const Icon = option.icon
              return (
                <div key={option.id} className="relative">
                  <Label
                    htmlFor={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedAction === option.id
                        ? option.isRecommended
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-900 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        option.isRecommended ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${option.isRecommended ? "text-blue-600" : "text-gray-600"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{option.title}</h3>
                        {option.isRecommended && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">AI Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Experiment Results */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Previous Experiment Results</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Low CTR Segment - Title Optimization Experiment (14 days)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Group */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  Control Group
                </CardTitle>
                <p className="text-sm text-muted-foreground">Original product titles</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Impressions</span>
                  </div>
                  <span className="text-lg font-bold">847,230</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Average CPC</span>
                  </div>
                  <span className="text-lg font-bold">£0.34</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">ROI</span>
                  </div>
                  <span className="text-lg font-bold">2.1x</span>
                </div>
              </CardContent>
            </Card>

            {/* Test Group */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Test Group
                  <Badge className="bg-green-100 text-green-800">Winner</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">AI-optimized product titles</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Impressions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">1,124,890</span>
                    <div className="text-xs text-green-600 font-medium">+32.8%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Average CPC</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">£0.29</span>
                    <div className="text-xs text-green-600 font-medium">-14.7%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">ROI</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">3.4x</span>
                    <div className="text-xs text-green-600 font-medium">+61.9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <Card className="bg-blue-50/30 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Experiment Summary</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    AI-optimized titles generated <span className="font-semibold">£12,400 additional revenue</span> over
                    14 days with <span className="font-semibold">95% statistical confidence</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-8 border-t">
        <div className="flex gap-3">
          <Button variant="outline">Save Draft</Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Apply to Segment</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Run Experiment</Button>
        </div>
      </div>
    </div>
  )
}
