"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

interface PivotTableProps {
  products: Product[]
}

export function PivotTable({ products }: PivotTableProps) {
  // Group products by brand and category
  const pivotData = products.reduce((acc, product) => {
    const key = `${product.brand}-${product.category}`
    if (!acc[key]) {
      acc[key] = {
        brand: product.brand,
        category: product.category,
        count: 0,
        totalRevenue: 0,
        avgVisibility: 0,
        totalImpressions: 0,
      }
    }
    acc[key].count += 1
    acc[key].totalRevenue += product.revenue
    acc[key].totalImpressions += product.impressions
    acc[key].avgVisibility = (acc[key].avgVisibility * (acc[key].count - 1) + product.visibilityScore) / acc[key].count
    return acc
  }, {} as Record<string, any>)

  const pivotRows = Object.values(pivotData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pivot Analysis</CardTitle>
        <CardDescription>Product performance grouped by brand and category</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Avg Visibility</TableHead>
              <TableHead>Total Impressions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pivotRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="outline">{row.brand}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.category}</Badge>
                </TableCell>
                <TableCell className="font-medium">{row.count}</TableCell>
                <TableCell className="font-medium">£{row.totalRevenue.toLocaleString()}</TableCell>
                <TableCell className="font-medium">{row.avgVisibility.toFixed(1)}%</TableCell>
                <TableCell className="font-medium">{row.totalImpressions.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
