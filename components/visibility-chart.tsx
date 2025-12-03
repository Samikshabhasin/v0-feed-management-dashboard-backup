"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts"
import { Eye, MousePointer, TrendingUp, BarChart3 } from "lucide-react"
import type { Product } from "@/types/product"

// Generate mock trend data for different metrics
const generateTrendData = (days: number, metric: string) => {
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    let value = 0
    switch (metric) {
      case "visibilityScore":
        value = 65 + Math.sin(i / 7) * 10 + Math.random() * 8 - 4
        value = Math.max(0, Math.min(100, value))
        break
      case "avgCpc":
        value = 0.55 + Math.sin(i / 5) * 0.15 + Math.random() * 0.1 - 0.05
        value = Math.max(0.1, value)
        break
      case "impressions":
        value = 18500 + Math.sin(i / 6) * 3000 + Math.random() * 2000 - 1000
        value = Math.max(0, value)
        break
      case "ctr":
        value = 6.2 + Math.sin(i / 8) * 1.5 + Math.random() * 1 - 0.5
        value = Math.max(0, value)
        break
    }

    data.push({
      day: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      fullDate: date.toISOString().split("T")[0],
      [metric]: value,
    })
  }
  return data
}

const metrics = {
  visibilityScore: {
    label: "Visibility Score",
    icon: Eye,
    color: "#3b82f6",
    unit: "%",
    goodThreshold: 70,
    poorThreshold: 40,
    format: (value: number) => `${value.toFixed(1)}%`,
  },
  avgCpc: {
    label: "Average CPC",
    icon: MousePointer,
    color: "#10b981",
    unit: "$",
    goodThreshold: 0.5,
    poorThreshold: 0.8,
    format: (value: number) => `$${value.toFixed(2)}`,
    inverted: true,
  },
  impressions: {
    label: "Impressions",
    icon: BarChart3,
    color: "#8b5cf6",
    unit: "",
    goodThreshold: 20000,
    poorThreshold: 10000,
    format: (value: number) => value.toLocaleString(),
  },
  ctr: {
    label: "Click-Through Rate",
    icon: TrendingUp,
    color: "#f59e0b",
    unit: "%",
    goodThreshold: 6,
    poorThreshold: 4,
    format: (value: number) => `${value.toFixed(2)}%`,
  },
}

interface VisibilityChartProps {
  products: Product[]
}

const data = [
  { category: "Electronics", visibility: 85 },
  { category: "Footwear", visibility: 92 },
  { category: "Apparel", visibility: 78 },
  { category: "Home & Garden", visibility: 65 },
  { category: "Sports", visibility: 88 },
  { category: "Accessories", visibility: 72 },
]

export function VisibilityChart({ products }: VisibilityChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metrics>("visibilityScore")
  const [selectedRange, setSelectedRange] = useState("30")

  const currentMetric = metrics[selectedMetric]
  const MetricIcon = currentMetric.icon

  // Generate data based on selected metric and range
  const chartData = generateTrendData(Number.parseInt(selectedRange), selectedMetric)

  const currentValue = chartData[chartData.length - 1][selectedMetric]
  const previousValue = chartData[chartData.length - 2][selectedMetric]
  const valueChange = currentValue - previousValue
  const valueChangePercent = ((valueChange / previousValue) * 100).toFixed(1)

  const isPositiveChange = currentMetric.inverted ? valueChange < 0 : valueChange > 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p style={{ color: currentMetric.color }}>
            {currentMetric.label}: <span className="font-bold">{currentMetric.format(payload[0].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Metric and Range Selectors */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedMetric} onValueChange={(value: keyof typeof metrics) => setSelectedMetric(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visibilityScore">Visibility Score</SelectItem>
              <SelectItem value="avgCpc">Average CPC</SelectItem>
              <SelectItem value="impressions">Impressions</SelectItem>
              <SelectItem value="ctr">Click-Through Rate</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Value Display */}
        <div className="flex items-center space-x-2">
          <MetricIcon className="h-5 w-5 text-muted-foreground" />
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: currentMetric.color }}>
              {currentMetric.format(currentValue)}
            </div>
            <div className={`text-sm ${isPositiveChange ? "text-green-600" : "text-red-600"}`}>
              {isPositiveChange ? "↗" : "↘"} {Math.abs(Number.parseFloat(valueChangePercent))}% vs yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        {selectedMetric === "visibilityScore" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                interval={selectedRange === "90" ? 6 : selectedRange === "30" ? 2 : "preserveStartEnd"}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => currentMetric.format(value)} />
              <Tooltip content={<CustomTooltip />} />

              {/* Reference lines based on metric */}
              <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="5 5" label="Good" />
              <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="5 5" label="Poor" />

              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric.color}
                strokeWidth={3}
                dot={{ fill: currentMetric.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {selectedMetric !== "visibilityScore" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visibility" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
