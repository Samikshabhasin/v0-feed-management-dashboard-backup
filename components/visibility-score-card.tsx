"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingDown } from "lucide-react"

export function VisibilityScoreCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Visibility Score (test)</CardTitle>

        <CardDescription>Overall product visibility across all channels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">87.4%</div>
          <Badge variant="outline" className="text-red-600 border-red-600">
            <TrendingDown className="h-3 w-3 mr-1" />
            -1.2%
          </Badge>
        </div>
        <Progress value={87.4} className="h-2" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Google Shopping</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Facebook Catalog</span>
            <span className="font-medium">85%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Amazon</span>
            <span className="font-medium">78%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bing Shopping</span>
            <span className="font-medium">94%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
