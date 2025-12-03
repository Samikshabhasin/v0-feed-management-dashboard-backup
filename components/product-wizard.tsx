"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Wand2 } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductWizardProps {
  products: Product[]
}

export function ProductWizard({ products }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  const steps = ["Review Product", "Optimize Title", "Enhance Description", "Adjust Pricing", "Review Changes"]

  const currentProduct = products[currentProductIndex]
  const progress = ((currentProductIndex * steps.length + currentStep + 1) / (products.length * steps.length)) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1)
      setCurrentStep(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1)
      setCurrentStep(steps.length - 1)
    }
  }

  if (!currentProduct) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>No products available for optimization</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Optimization Wizard</CardTitle>
              <CardDescription>
                Product {currentProductIndex + 1} of {products.length} • Step {currentStep + 1} of {steps.length}
              </CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Product Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>{steps[currentStep]}</span>
          </CardTitle>
          <CardDescription>Optimizing: {currentProduct.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={currentProduct.imageUrl || "/placeholder.svg"}
                alt={currentProduct.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{currentProduct.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentProduct.brand} • {currentProduct.category}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">${currentProduct.price}</Badge>
                  <Badge variant={currentProduct.approvalStatus === "approved" ? "default" : "destructive"}>
                    {currentProduct.approvalStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Product Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Visibility Score</label>
                    <div className="text-2xl font-bold text-blue-600">{currentProduct.visibilityScore}%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Conversion Rate</label>
                    <div className="text-2xl font-bold text-green-600">{currentProduct.conversionRate}%</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Issues</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentProduct.issues.length > 0 ? (
                      currentProduct.issues.map((issue, index) => (
                        <Badge key={index} variant="destructive">
                          {issue}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        No Issues
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-medium">Title Optimization</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-red-600">Current Title</label>
                    <div className="p-3 bg-red-50 rounded border">{currentProduct.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-600">Suggested Title</label>
                    <div className="p-3 bg-green-50 rounded border">
                      {currentProduct.name} - {currentProduct.color} {currentProduct.size} - Premium Quality - Free
                      Shipping
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Improvements:</strong> Added color, size, quality indicators, and shipping benefit
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-medium">Description Enhancement</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-red-600">Current Description</label>
                    <div className="p-3 bg-red-50 rounded border text-sm">{currentProduct.description}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-600">Enhanced Description</label>
                    <div className="p-3 bg-green-50 rounded border text-sm">
                      {currentProduct.description} Features premium {currentProduct.material} construction with superior
                      comfort and durability. Perfect for daily wear with a modern design that complements any style.
                      Available in {currentProduct.color} color. Backed by our satisfaction guarantee with fast, free
                      shipping.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-medium">Price Optimization</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-sm font-medium text-red-600">Current Price</div>
                    <div className="text-xl font-bold">${currentProduct.price}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-sm font-medium text-yellow-600">Market Average</div>
                    <div className="text-xl font-bold">${(currentProduct.price * 0.95).toFixed(2)}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-sm font-medium text-green-600">Suggested Price</div>
                    <div className="text-xl font-bold">${(currentProduct.price * 0.92).toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Analysis:</strong> Reducing price by 8% could increase conversions by an estimated 15-20%
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h4 className="font-medium">Review Changes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Title Optimization</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Description Enhancement</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Price Adjustment</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Expected Impact</h5>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <div className="font-medium">CTR Improvement</div>
                      <div className="text-green-600">+25%</div>
                    </div>
                    <div>
                      <div className="font-medium">Conversion Rate</div>
                      <div className="text-green-600">+18%</div>
                    </div>
                    <div>
                      <div className="font-medium">Revenue Impact</div>
                      <div className="text-green-600">+$2,400/month</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button onClick={prevStep} disabled={currentStep === 0 && currentProductIndex === 0} variant="outline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>

        <Button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1 && currentProductIndex === products.length - 1}
        >
          {currentStep === steps.length - 1
            ? currentProductIndex === products.length - 1
              ? "Complete"
              : "Next Product"
            : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
