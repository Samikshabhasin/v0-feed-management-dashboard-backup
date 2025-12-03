"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, TrendingUp, DollarSign, ShoppingCart, Target, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const performanceData = [
  { date: "Jan 1", revenue: 45000, conversions: 234, clicks: 3400, impressions: 45000 },
  { date: "Jan 8", revenue: 52000, conversions: 267, clicks: 3800, impressions: 48000 },
  { date: "Jan 15", revenue: 48000, conversions: 245, clicks: 3600, impressions: 46000 },
  { date: "Jan 22", revenue: 61000, conversions: 312, clicks: 4200, impressions: 52000 },
  { date: "Jan 29", revenue: 58000, conversions: 298, clicks: 4000, impressions: 50000 },
  { date: "Feb 5", revenue: 67000, conversions: 345, clicks: 4600, impressions: 55000 },
  { date: "Feb 12", revenue: 72000, conversions: 378, clicks: 4900, impressions: 58000 },
]

const categoryData = [
  { name: "Electronics", value: 35, color: "#8884d8" },
  { name: "Clothing", value: 28, color: "#82ca9d" },
  { name: "Home & Garden", value: 20, color: "#ffc658" },
  { name: "Sports", value: 17, color: "#ff7300" },
]

const optimizationImpact = [
  { type: "Title Optimization", before: 2.3, after: 3.1, improvement: 34.8 },
  { type: "Description Enhancement", before: 4.2, after: 5.8, improvement: 38.1 },
  { type: "Price Optimization", before: 1.8, after: 2.9, improvement: 61.1 },
  { type: "Image Optimization", before: 3.5, after: 4.2, improvement: 20.0 },
]

export function ImpactPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Impact Analysis</h2>
          <p className="text-muted-foreground">Phase 3: Measure the results of your optimization efforts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
          <Button>Schedule Report</Button>
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+$284K</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18.2%
              </span>
              vs previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +1.5%
              </span>
              from 4.3% baseline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Optimized</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-blue-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                97% success rate
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340%</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Excellent ROI
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Impact</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track key metrics over time to measure optimization impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="impressions">Impressions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: "#8884d8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Key milestones and improvements from your optimization efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Highest Monthly Revenue</p>
                      <p className="text-sm text-muted-foreground">Achieved $2.4M in February 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+18% vs target</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Conversion Rate Milestone</p>
                      <p className="text-sm text-muted-foreground">Exceeded 5% conversion rate for first time</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">New Record</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Feed Health Improvement</p>
                      <p className="text-sm text-muted-foreground">Reduced error rate by 67%</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Major Improvement</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Impact Analysis</CardTitle>
              <CardDescription>Compare before and after metrics for each optimization type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {optimizationImpact.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.type}</h4>
                      <Badge className="bg-green-100 text-green-800">+{item.improvement.toFixed(1)}% improvement</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="font-medium text-red-600">Before</div>
                        <div className="text-lg font-bold">{item.before}%</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="font-medium text-green-600">After</div>
                        <div className="text-lg font-bold">{item.after}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Comparison</CardTitle>
              <CardDescription>Analyze optimization impact across different product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Timeline</CardTitle>
              <CardDescription>Track when optimizations were applied and their cumulative impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="relative flex items-center space-x-4 pb-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Title Optimization Campaign</h4>
                        <span className="text-sm text-muted-foreground">Feb 15, 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Optimized 450 product titles</p>
                      <Badge className="mt-1 bg-green-100 text-green-800">+34% CTR improvement</Badge>
                    </div>
                  </div>

                  <div className="relative flex items-center space-x-4 pb-6">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Description Enhancement</h4>
                        <span className="text-sm text-muted-foreground">Feb 8, 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Enhanced 320 product descriptions</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800">+28% conversion rate</Badge>
                    </div>
                  </div>

                  <div className="relative flex items-center space-x-4 pb-6">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Price Optimization</h4>
                        <span className="text-sm text-muted-foreground">Jan 28, 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Adjusted pricing for 180 products</p>
                      <Badge className="mt-1 bg-purple-100 text-purple-800">+61% sales increase</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
