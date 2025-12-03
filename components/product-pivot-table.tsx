"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table } from 'lucide-react'

export function ProductPivotTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance Pivot</CardTitle>
        <CardDescription>Detailed product metrics breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Table className="h-8 w-8 mx-auto mb-2" />
            <p>Product pivot table</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
