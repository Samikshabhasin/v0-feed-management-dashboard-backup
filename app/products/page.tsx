import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Package, CheckCircle2, XCircle, MoreVertical, Eye, Edit, TrendingUp, Trash2 } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"

// Declare filteredProducts variable
const filteredProducts = [
  // Sample product data
  {
    id: 1,
    name: "Sample Product",
    brand: "Sample Brand",
    category: "Sample Category",
    currency: "USD",
    price: 19.99,
    availability: "in stock",
    visibilityScore: 85,
    ctr: 3.2,
    conversionRate: 2.5,
    enable_search: "yes",
    enable_checkout: "no",
    imageQuality: "high",
    approvalStatus: "approved",
    imageUrl: "/sample-image.jpg",
  },
  // Add more products as needed
]

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Manage and optimize your product feed with AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-center">Visibility</TableHead>
                  <TableHead className="text-center">CTR</TableHead>
                  <TableHead className="text-center">Conv. Rate</TableHead>
                  <TableHead className="text-center">AI Search</TableHead>
                  <TableHead className="text-center">AI Checkout</TableHead>
                  <TableHead className="text-center">Image Quality</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{product.brand}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {product.currency} {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.availability === "in stock"
                            ? "default"
                            : product.availability === "out of stock"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {product.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            product.visibilityScore >= 80
                              ? "bg-green-500"
                              : product.visibilityScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500",
                          )}
                        />
                        <span className="text-sm font-medium">{product.visibilityScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">{product.ctr.toFixed(2)}%</TableCell>
                    <TableCell className="text-center text-sm">{product.conversionRate.toFixed(2)}%</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.enable_search === "yes" ? "default" : "secondary"} className="text-xs">
                        {product.enable_search === "yes" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {product.enable_search === "yes" ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.enable_checkout === "yes" ? "default" : "secondary"} className="text-xs">
                        {product.enable_checkout === "yes" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {product.enable_checkout === "yes" ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.imageQuality ? (
                        <Badge
                          variant={
                            product.imageQuality === "high"
                              ? "default"
                              : product.imageQuality === "low"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs capitalize"
                        >
                          {product.imageQuality}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.approvalStatus === "approved"
                            ? "default"
                            : product.approvalStatus === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs capitalize"
                      >
                        {product.approvalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
