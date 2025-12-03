"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X } from "lucide-react"

export function ProblemProductsAlert() {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Critical Issues Detected</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-red-700">
          Several products require immediate attention to maintain performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">High Priority</Badge>
              <span className="text-sm">23 products disapproved by Google</span>
            </div>
            <Button size="sm" variant="outline">
              Fix Now
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Medium Priority</Badge>
              <span className="text-sm">147 products missing required attributes</span>
            </div>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Low Priority</Badge>
              <span className="text-sm">89 products with outdated images</span>
            </div>
            <Button size="sm" variant="outline">
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
