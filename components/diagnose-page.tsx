"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Calendar,
  Lock,
  Info,
  Zap,
  TrendingUp,
  PieChart,
  Eye,
  Activity,
  Package,
  Filter,
  RefreshCw,
  Columns,
} from "lucide-react"
import { SegmentBuilder } from "./segment-builder"
import ProductTrendGraph from "./product-trend-graph" // Fixed import to use default export instead of named export
import { addAlgoliaSearchData } from "./algolia-search-data"
import type { Product } from "@/types/product"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

// Available columns for the table - organized by data source
const availableColumns = [
  // Product Attributes
  { key: "productId", label: "Product ID", category: "Product", default: true },
  { key: "product", label: "Product Title", category: "Product", default: true },
  { key: "thumbnail", label: "Thumbnail", category: "Product", default: true },
  { key: "channelStatus", label: "Channel Status", category: "Product", default: true },
  { key: "aiDiagnostic", label: "AI Diagnostic", category: "AI Diagnostics", default: true },
  { key: "aiDetections", label: "AI Detections", category: "AI Diagnostics", default: true },
  { key: "imageQuality", label: "Image Quality", category: "Product", default: true },
  { key: "impressionChange", label: "Impression Change %", category: "Performance Drivers", default: true },
  { key: "visibility", label: "Visibility Score", category: "Google Ads", default: true },
  { key: "clickChange", label: "Click Change %", category: "Performance Drivers", default: true },
  { key: "ctr", label: "CTR", category: "Google Ads", default: true },
  { key: "revenueChange", label: "Revenue Change %", category: "Performance Drivers", default: true },
  { key: "gmcIssueType", label: "GMC Issue Type", category: "Feed", default: true },
  { key: "issueTimestamp", label: "Issue Timestamp", category: "Feed", default: true },
  { key: "resolutionStatus", label: "Resolution Status", category: "Feed", default: true },
  { key: "actions", label: "Actions", category: "Actions", default: true },

  { key: "brand", label: "Brand", category: "Product", default: false },
  { key: "category", label: "Category", category: "Product", default: false },
  { key: "price", label: "Price", category: "Product", default: false },
  { key: "color", label: "Color", category: "Product", default: false },
  { key: "size", label: "Size", category: "Product", default: false },
  { key: "material", label: "Material", category: "Product", default: false },
  { key: "condition", label: "Condition", category: "Product", default: false },
  { key: "gtin", label: "GTIN", category: "Product", default: false },
  { key: "mpn", label: "MPN", category: "Product", default: false },
  { key: "stock", label: "Stock", category: "Product", default: false },
  { key: "inventoryLevel", label: "Inventory Level", category: "Product", default: false },
  { key: "shippingCost", label: "Shipping Cost", category: "Product", default: false },
  { key: "targetCountry", label: "Target Country", category: "Product", default: false },
  { key: "feedSource", label: "Feed Source", category: "Product", default: false },
  { key: "customLabels", label: "Custom Labels", category: "Product", default: false },
  { key: "lastUpdated", label: "Last Updated", category: "Product", default: false },

  // Feed Status
  { key: "status", label: "Approval Status", category: "Feed", default: false },
  { key: "issues", label: "Issues", category: "Feed", default: false },
  { key: "opportunities", label: "Opportunities", category: "Feed", default: false },

  // Google Ads Performance
  { key: "impressions", label: "Impressions", category: "Google Ads", default: false },
  { key: "clicks", label: "Clicks", category: "Google Ads", default: false },
  { key: "cpc", label: "CPC", category: "Google Ads", default: false },
  { key: "conversions", label: "Conversions", category: "Google Ads", default: false },
  { key: "convRate", label: "Conversion Rate", category: "Google Ads", default: false },
  { key: "revenue", label: "Revenue", category: "Google Ads", default: false },
  { key: "roas", label: "ROAS", category: "Google Ads", default: false },
  { key: "roi", label: "ROI", category: "Google Ads", default: false },

  // Performance Drivers
  { key: "changePercent", label: "Change %", category: "Performance Drivers", default: false },
  { key: "direction", label: "Direction", category: "Performance Drivers", default: false },
  { key: "causeDriver", label: "Cause / Driver", category: "Performance Drivers", default: false },
  { key: "channelImpact", label: "Channel Impact", category: "Performance Drivers", default: false },

  // AI Diagnostics
  { key: "causeDetected", label: "Cause Detected", category: "AI Diagnostics", default: false },

  // Date Range
  { key: "changePeriod", label: "Change Period", category: "Date Range", default: false },

  // AI Commerce
  { key: "enable_search", label: "Enable Search", category: "AI Commerce", default: false },
  { key: "enable_checkout", label: "Enable Checkout", category: "AI Commerce", default: false },

  // Search Intelligence (Algolia)
  { key: "searchImpressions", label: "Search Impressions", category: "Search Intelligence", default: false },
  { key: "searchClicks", label: "Search Clicks", category: "Search Intelligence", default: false },
  { key: "searchCtr", label: "Search CTR", category: "Search Intelligence", default: false },
  { key: "searchAddToCarts", label: "Search Add to Carts", category: "Search Intelligence", default: false },
  { key: "searchPurchases", label: "Search Purchases", category: "Search Intelligence", default: false },
  { key: "searchConvRate", label: "Search Conv Rate", category: "Search Intelligence", default: false },
  { key: "topSearchTerms", label: "Top Search Terms", category: "Search Intelligence", default: false },
  { key: "searchTerms", label: "Search Terms", category: "Search Intelligence", default: false },

  // On-site Performance
  { key: "returnRate", label: "Return Rate", category: "On-site", default: false },
  { key: "bounceRate", label: "Bounce Rate", category: "On-site", default: false },
  { key: "pageViews", label: "Page Views", category: "On-site", default: false },
  { key: "timeOnPage", label: "Time on Page", category: "On-site", default: false },
  { key: "addToCartRate", label: "Add to Cart Rate", category: "On-site", default: false },
  { key: "wishlistAdds", label: "Wishlist Adds", category: "On-site", default: false },
]

// Enhanced mock data with realistic search terms and varied performance
const mockProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    category: "Footwear > Athletic Shoes > Running",
    price: 150.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 28,
    clicks: 2450,
    impressions: 28600,
    ctr: 8.57,
    cpc: 0.65,
    conversions: 189,
    revenue: 28350.0,
    roas: 4.2,
    conversionRate: 7.71,
    returnRate: 3.2,
    bounceRate: 24.5,
    approvalStatus: "disapproved",
    lastUpdated: "2024-01-15T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Comfortable running shoes with Air Max cushioning technology",
    gtin: "1234567890123",
    mpn: "AM270-BLK-10",
    inventoryLevel: 150,
    shippingCost: 0.0,
    color: "Black",
    size: "10",
    material: "Synthetic",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Best Seller", "All Season"],
    issues: ["Image quality and resolution"],
    opportunities: ["Add more size variants", "Optimize for seasonal keywords"],
    searchImpressions: 85000,
    searchClicks: 4200,
    searchCtr: 4.94,
    searchAddToCarts: 850,
    searchPurchases: 180,
    searchConversionRate: 4.29,
    topSearchTerms: ["nike air max", "running shoes", "black sneakers", "athletic footwear"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-001",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-15T10:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -55.2,
    clickChange: -35.8,
    revenueChange: -40.1,
  },
  {
    id: "PROD-002",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Electronics > Mobile Phones > Smartphones",
    price: 999.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 32,
    clicks: 4200,
    impressions: 48500,
    ctr: 8.66,
    cpc: 1.25,
    conversions: 312,
    revenue: 311688.0,
    roas: 5.8,
    conversionRate: 7.43,
    returnRate: 1.2,
    bounceRate: 15.8,
    approvalStatus: "approved",
    lastUpdated: "2024-01-18T08:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Latest iPhone with titanium design and A17 Pro chip",
    gtin: "3234567890123",
    mpn: "IP15P-TIT-128",
    inventoryLevel: 85,
    shippingCost: 0.0,
    color: "Titanium",
    size: "128GB",
    material: "Titanium",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Latest", "Technology"],
    issues: ["Image quality and resolution"],
    opportunities: ["Bundle with accessories", "Trade-in promotions"],
    searchImpressions: 120000,
    searchClicks: 6800,
    searchCtr: 5.67,
    searchAddToCarts: 1200,
    searchPurchases: 290,
    searchConversionRate: 4.26,
    topSearchTerms: ["iphone 15 pro", "apple phone", "titanium iphone", "latest iphone"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-002",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-18T08:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -48.5,
    clickChange: -32.2,
    revenueChange: -38.3,
  },
  {
    id: "PROD-003",
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "Footwear > Athletic Shoes > Running",
    price: 180.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 25,
    clicks: 2680,
    impressions: 31200,
    ctr: 8.59,
    cpc: 0.68,
    conversions: 201,
    revenue: 36180.0,
    roas: 4.3,
    conversionRate: 7.5,
    returnRate: 2.9,
    bounceRate: 21.8,
    approvalStatus: "approved",
    lastUpdated: "2024-01-15T09:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Premium running shoes with Boost technology",
    gtin: "2234567890123",
    mpn: "UB22-WHT-10",
    inventoryLevel: 140,
    shippingCost: 0.0,
    color: "White",
    size: "10",
    material: "Primeknit",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Running", "All Season"],
    issues: ["Image quality and resolution"],
    opportunities: ["Add more colorways", "Cross-sell with apparel"],
    searchImpressions: 72000,
    searchClicks: 3600,
    searchCtr: 5.0,
    searchAddToCarts: 720,
    searchPurchases: 195,
    searchConversionRate: 5.42,
    topSearchTerms: ["adidas ultraboost", "boost running shoes", "white sneakers", "primeknit shoes"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-003",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-15T09:45:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -50.5,
    clickChange: -30.2,
    revenueChange: -35.8,
  },
  {
    id: "PROD-004",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Electronics > Mobile Phones > Smartphones",
    price: 1199.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 30,
    clicks: 3850,
    impressions: 44200,
    ctr: 8.71,
    cpc: 1.35,
    conversions: 285,
    revenue: 341715.0,
    roas: 5.5,
    conversionRate: 7.4,
    returnRate: 1.4,
    bounceRate: 16.8,
    approvalStatus: "approved",
    lastUpdated: "2024-01-18T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Premium Android smartphone with S Pen and AI features",
    gtin: "4234567890123",
    mpn: "GS24U-TIT-256",
    inventoryLevel: 75,
    shippingCost: 0.0,
    color: "Titanium",
    size: "256GB",
    material: "Titanium",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Android", "Technology"],
    issues: ["Image quality and resolution"],
    opportunities: ["Trade-in programs", "Business features"],
    searchImpressions: 95000,
    searchClicks: 5200,
    searchCtr: 5.47,
    searchAddToCarts: 980,
    searchPurchases: 275,
    searchConversionRate: 5.29,
    topSearchTerms: ["samsung galaxy s24", "android phone", "s pen phone", "galaxy ultra"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-004",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-18T09:15:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -5.0,
    clickChange: -10.5,
    revenueChange: -15.3,
  },
  {
    id: "PROD-005",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "Electronics > Audio > Headphones",
    price: 399.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 22,
    clicks: 2450,
    impressions: 29800,
    ctr: 8.22,
    cpc: 0.95,
    conversions: 189,
    revenue: 75411.0,
    roas: 3.2,
    conversionRate: 7.71,
    returnRate: 1.6,
    bounceRate: 18.9,
    approvalStatus: "approved",
    lastUpdated: "2024-01-18T13:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Industry-leading noise canceling wireless headphones",
    gtin: "5234567890123",
    mpn: "WH1000XM5-BLK",
    inventoryLevel: 95,
    shippingCost: 0.0,
    color: "Black",
    size: "Over-ear",
    material: "Plastic",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Audio", "Noise Canceling"],
    issues: ["Image quality and resolution"],
    opportunities: ["Audiophile targeting", "Travel market"],
    searchImpressions: 68000,
    searchClicks: 3400,
    searchCtr: 5.0,
    searchAddToCarts: 680,
    searchPurchases: 185,
    searchConversionRate: 5.44,
    topSearchTerms: ["sony headphones", "noise canceling", "wireless headphones", "wh-1000xm5"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-005",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-18T13:20:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -48.2,
    clickChange: -28.5,
    revenueChange: -32.0,
  },
  {
    id: "PROD-006",
    name: "Nike Training Shorts",
    brand: "Nike",
    category: "Apparel > Athletic Wear > Shorts",
    price: 0, // Missing price
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 20,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0,
    conversions: 0,
    revenue: 0,
    roas: 0,
    conversionRate: 0,
    returnRate: 0,
    bounceRate: 0,
    approvalStatus: "pending",
    lastUpdated: "2024-01-18T09:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "",
    gtin: "", // Missing GTIN
    mpn: "TS-BLK-M",
    inventoryLevel: 200,
    shippingCost: 4.99,
    color: "Black",
    size: "M",
    material: "Polyester",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Athletic", "Training", "Summer"],
    issues: ["Missing GTIN", "Missing image", "Missing price"],
    opportunities: ["Complete product data", "Add required attributes"],
    searchImpressions: 0,
    searchClicks: 0,
    searchCtr: 0,
    searchAddToCarts: 0,
    searchPurchases: 0,
    searchConversionRate: 0,
    topSearchTerms: [],
    enable_search: "no",
    enable_checkout: "no",
    imageQuality: "poor",
    productId: "PROD-006",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Image quality issues", "Low resolution"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-18T09:20:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -60.0,
    clickChange: -40.0,
    revenueChange: -50.0,
  },
  {
    id: "PROD-007",
    name: "Fake Designer Handbag",
    brand: "Counterfeit Co",
    category: "Apparel > Accessories > Handbags",
    price: 89.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 18,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0,
    conversions: 0,
    revenue: 0,
    roas: 0,
    conversionRate: 0,
    returnRate: 0,
    bounceRate: 0,
    approvalStatus: "disapproved",
    lastUpdated: "2024-01-17T08:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Replica designer handbag with similar styling",
    gtin: "9999567890123",
    mpn: "FB-REP-001",
    inventoryLevel: 25,
    shippingCost: 12.99,
    color: "Brown",
    size: "Medium",
    material: "Synthetic Leather",
    targetCountry: "US",
    feedSource: "Secondary Feed",
    customLabels: ["Fashion", "Accessories"],
    issues: ["Policy violation", "Trademark infringement", "Counterfeit product"],
    opportunities: ["Remove listing", "Source authentic products"],
    searchImpressions: 0,
    searchClicks: 0,
    searchCtr: 0,
    searchAddToCarts: 0,
    searchPurchases: 0,
    searchConversionRate: 0,
    topSearchTerms: [],
    enable_search: "no",
    enable_checkout: "no",
    imageQuality: "poor",
    productId: "PROD-007",
    channelStatus: "Disapproved",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Policy violation", "Trademark infringement"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-17T08:15:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -70.0,
    clickChange: -50.0,
    revenueChange: -60.0,
  },
  // High search demand, low ad visibility products
  {
    id: "PROD-008",
    name: "Waterproof Winter Jacket",
    brand: "Nike",
    category: "Apparel > Outerwear > Jackets",
    price: 220.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 24,
    clicks: 850,
    impressions: 12000,
    ctr: 7.08,
    cpc: 0.85,
    conversions: 65,
    revenue: 14300.0,
    roas: 3.8,
    conversionRate: 7.65,
    returnRate: 2.1,
    bounceRate: 22.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-16T11:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Waterproof winter jacket with thermal insulation",
    gtin: "6234567890123",
    mpn: "WJ-BLK-L",
    inventoryLevel: 120,
    shippingCost: 0.0,
    color: "Black",
    size: "L",
    material: "Nylon",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Winter", "Waterproof", "Premium"],
    issues: ["Image quality and resolution"],
    opportunities: ["Increase ad visibility", "Seasonal promotion"],
    searchImpressions: 65000,
    searchClicks: 4500,
    searchCtr: 6.92,
    searchAddToCarts: 920,
    searchPurchases: 85,
    searchConversionRate: 1.89,
    topSearchTerms: ["waterproof jacket", "winter coat", "nike jacket", "thermal jacket"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-008",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Low visibility score"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-16T11:20:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -45.0,
    clickChange: -25.0,
    revenueChange: -30.0,
  },
  // High CPC, low conversion products
  {
    id: "PROD-009",
    name: "Premium Leather Boots",
    brand: "Adidas",
    category: "Footwear > Boots > Fashion",
    price: 350.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 27,
    clicks: 1200,
    impressions: 18500,
    ctr: 6.49,
    cpc: 1.85,
    conversions: 35,
    revenue: 12250.0,
    roas: 2.1,
    conversionRate: 2.92,
    returnRate: 4.8,
    bounceRate: 35.2,
    approvalStatus: "approved",
    lastUpdated: "2024-01-17T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Premium leather boots with comfort sole",
    gtin: "7234567890123",
    mpn: "PLB-BRN-9",
    inventoryLevel: 85,
    shippingCost: 0.0,
    color: "Brown",
    size: "9",
    material: "Leather",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Premium", "Leather", "Fashion"],
    issues: ["Image quality and resolution"],
    opportunities: ["Optimize landing page", "Improve product images"],
    searchImpressions: 42000,
    searchClicks: 2800,
    searchCtr: 6.67,
    searchAddToCarts: 450,
    searchPurchases: 32,
    searchConversionRate: 1.14,
    topSearchTerms: ["leather boots", "premium boots", "adidas boots", "fashion boots"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-009",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["High CPC, low conversion rate"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-17T14:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -10.0,
    clickChange: -5.0,
    revenueChange: -8.0,
  },
  // High search clicks, low conversion
  {
    id: "PROD-010",
    name: "Gaming Headset Pro",
    brand: "Sony",
    category: "Electronics > Audio > Gaming",
    price: 199.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 33,
    clicks: 1850,
    impressions: 24500,
    ctr: 7.55,
    cpc: 0.75,
    conversions: 125,
    revenue: 24875.0,
    roas: 4.1,
    conversionRate: 6.76,
    returnRate: 3.2,
    bounceRate: 28.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-18T16:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1599669454699-248893623440?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Professional gaming headset with surround sound",
    gtin: "8234567890123",
    mpn: "GHP-BLK-PRO",
    inventoryLevel: 95,
    shippingCost: 0.0,
    color: "Black",
    size: "Standard",
    material: "Plastic",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Gaming", "Pro", "Audio"],
    issues: ["Image quality and resolution"],
    opportunities: ["Gaming community targeting", "Streamer partnerships"],
    searchImpressions: 58000,
    searchClicks: 4200,
    searchCtr: 7.24,
    searchAddToCarts: 850,
    searchPurchases: 45,
    searchConversionRate: 1.07,
    topSearchTerms: ["gaming headset", "pro headset", "sony gaming", "surround sound headset"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-010",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["High search clicks, low conversion rate"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-18T16:45:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: 2.0,
    clickChange: 5.0,
    revenueChange: 3.0,
  },
  // Additional products with zero conversions for wasted spend demo
  {
    id: "PROD-011",
    name: "Expensive Watch",
    brand: "Luxury Brand",
    category: "Accessories > Watches > Luxury",
    price: 2500.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 21,
    clicks: 450,
    impressions: 8500,
    ctr: 5.29,
    cpc: 3.5,
    conversions: 0,
    revenue: 0,
    roas: 0,
    conversionRate: 0,
    returnRate: 0,
    bounceRate: 85.2,
    approvalStatus: "approved",
    lastUpdated: "2024-01-17T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Luxury timepiece with premium materials",
    gtin: "1122334455667",
    mpn: "LUX-WATCH-001",
    inventoryLevel: 15,
    shippingCost: 0.0,
    color: "Gold",
    size: "42mm",
    material: "Gold",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Luxury", "Premium", "Watches"],
    issues: ["Image quality and resolution"],
    opportunities: ["Target luxury audience", "Improve landing page"],
    searchImpressions: 25000,
    searchClicks: 1200,
    searchCtr: 4.8,
    searchAddToCarts: 45,
    searchPurchases: 0,
    searchConversionRate: 0,
    topSearchTerms: ["luxury watch", "gold watch", "premium timepiece", "expensive watch"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-011",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Zero conversions, high CPC"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-17T14:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -15.0,
    clickChange: -10.0,
    revenueChange: -20.0,
  },
  {
    id: "PROD-012",
    name: "Designer Sunglasses",
    brand: "Fashion Co",
    category: "Accessories > Eyewear > Sunglasses",
    price: 450.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 15,
    clicks: 320,
    impressions: 6200,
    ctr: 5.16,
    cpc: 2.25,
    conversions: 0,
    revenue: 0,
    roas: 0,
    conversionRate: 0,
    returnRate: 0,
    bounceRate: 78.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-16T11:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Designer sunglasses with UV protection",
    gtin: "2233445566778",
    mpn: "SUNGLASS-DES-001",
    inventoryLevel: 45,
    shippingCost: 0.0,
    color: "Black",
    size: "Medium",
    material: "Acetate",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Designer", "Fashion", "Eyewear"],
    issues: ["Image quality and resolution"],
    opportunities: ["Improve product images", "Target fashion audience"],
    searchImpressions: 18000,
    searchClicks: 850,
    searchCtr: 4.72,
    searchAddToCarts: 25,
    searchPurchases: 0,
    searchConversionRate: 0,
    topSearchTerms: ["designer sunglasses", "fashion eyewear", "luxury sunglasses", "black sunglasses"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-012",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Zero conversions, high CPC"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-16T11:20:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -12.0,
    clickChange: -8.0,
    revenueChange: -18.0,
  },
  // Products with missing GTIN for feed health demo
  {
    id: "PROD-013",
    name: "Basic T-Shirt",
    brand: "Generic Brand",
    category: "Apparel > Clothing > T-Shirts",
    price: 25.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 15,
    clicks: 50,
    impressions: 1200,
    ctr: 4.17,
    cpc: 0.35,
    conversions: 5,
    revenue: 125.0,
    roas: 7.1,
    conversionRate: 10.0,
    returnRate: 2.0,
    bounceRate: 45.2,
    approvalStatus: "pending",
    lastUpdated: "2024-01-18T09:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "Basic cotton t-shirt",
    gtin: "", // Missing GTIN
    mpn: "BASIC-TEE-001",
    inventoryLevel: 500,
    shippingCost: 2.99,
    color: "White",
    size: "L",
    material: "Cotton",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Basic", "Casual", "Cotton"],
    issues: ["Missing GTIN", "Low quality images"],
    opportunities: ["Add GTIN", "Improve images"],
    searchImpressions: 8000,
    searchClicks: 400,
    searchCtr: 5.0,
    searchAddToCarts: 80,
    searchPurchases: 8,
    searchConversionRate: 2.0,
    topSearchTerms: ["basic t-shirt", "white tee", "cotton shirt", "casual wear"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-013",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Missing GTIN"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION", // Adjusted GMC issue type to reflect the primary issue for demo
    issueTimestamp: "2024-01-18T09:20:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -58.0,
    clickChange: -38.0,
    revenueChange: -45.0,
  },
  {
    id: "PROD-014",
    name: "Workout Leggings",
    brand: "Fitness Brand",
    category: "Apparel > Athletic Wear > Leggings",
    price: 65.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 25,
    clicks: 180,
    impressions: 3500,
    ctr: 5.14,
    cpc: 0.85,
    conversions: 15,
    revenue: 975.0,
    roas: 6.4,
    conversionRate: 8.33,
    returnRate: 3.5,
    bounceRate: 38.2,
    approvalStatus: "pending",
    lastUpdated: "2024-01-17T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=60&h=60&fit=crop&crop=center&blur=10",
    description: "High-performance workout leggings",
    gtin: "", // Missing GTIN
    mpn: "LEGGINGS-FIT-001",
    inventoryLevel: 200,
    shippingCost: 0.0,
    color: "Black",
    size: "M",
    material: "Polyester",
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: ["Fitness", "Athletic", "Performance"],
    issues: ["Missing GTIN", "Missing size chart"],
    opportunities: ["Add GTIN", "Add size guide"],
    searchImpressions: 15000,
    searchClicks: 750,
    searchCtr: 5.0,
    searchAddToCarts: 120,
    searchPurchases: 18,
    searchConversionRate: 2.4,
    topSearchTerms: ["workout leggings", "fitness pants", "athletic wear", "gym leggings"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-014",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Image Quality and Resolution",
    aiDetections: ["Missing GTIN"], // Added AI Detections
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION", // Adjusted GMC issue type to reflect the primary issue for demo
    issueTimestamp: "2024-01-17T14:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -55.0,
    clickChange: -35.0,
    revenueChange: -40.0,
  },
]

const alternateProducts: Product[] = [
  {
    id: "PROD-ALT-001",
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Electronics > Wearables > Smartwatches",
    price: 349.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 25,
    clicks: 1200,
    impressions: 18000,
    ctr: 6.67,
    cpc: 0.95,
    conversions: 85,
    revenue: 29665.0,
    roas: 3.2,
    conversionRate: 7.08,
    returnRate: 3.5,
    bounceRate: 35.2,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=60&h=60&fit=crop&crop=center",
    description: "Advanced smartwatch with health tracking",
    gtin: "8801643123456",
    mpn: "SM-R950-BLK",
    inventoryLevel: 145,
    shippingCost: 0.0,
    color: "Black",
    size: "44mm",
    material: "Aluminum",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Wearable", "Health", "Smart"],
    issues: ["Blurry product images"],
    opportunities: ["Retake product photos", "Add lifestyle shots"],
    searchImpressions: 52000,
    searchClicks: 2800,
    searchCtr: 5.38,
    searchAddToCarts: 560,
    searchPurchases: 80,
    searchConversionRate: 2.86,
    topSearchTerms: ["samsung watch", "galaxy watch 6", "smartwatch"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-ALT-001",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Blurry product images detected",
    aiDetections: ["Blurry images", "Low resolution photos", "Poor lighting"],
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-20T10:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -42.5,
    clickChange: -28.8,
    revenueChange: -35.2,
  },
  {
    id: "PROD-ALT-002",
    name: "Canon EOS R6 Camera Body",
    brand: "Canon",
    category: "Electronics > Cameras > Mirrorless",
    price: 2499.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 18,
    clicks: 950,
    impressions: 15200,
    ctr: 6.25,
    cpc: 2.15,
    conversions: 42,
    revenue: 104958.0,
    roas: 2.8,
    conversionRate: 4.42,
    returnRate: 1.2,
    bounceRate: 28.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1606980707986-683d8dc3e93e?w=60&h=60&fit=crop&crop=center",
    description: "Professional mirrorless camera with 20MP sensor",
    gtin: "4549292156789",
    mpn: "EOSR6-BODY",
    inventoryLevel: 28,
    shippingCost: 0.0,
    color: "Black",
    size: "Body Only",
    material: "Magnesium Alloy",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Professional", "Photography", "Mirrorless"],
    issues: ["Missing product dimensions", "Incomplete specifications"],
    opportunities: ["Add detailed specs", "Include sample photos"],
    searchImpressions: 38000,
    searchClicks: 2100,
    searchCtr: 5.53,
    searchAddToCarts: 420,
    searchPurchases: 40,
    searchConversionRate: 1.9,
    topSearchTerms: ["canon r6", "mirrorless camera", "professional camera"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "medium",
    productId: "PROD-ALT-002",
    channelStatus: "Active",
    aiDiagnostic: "Missing critical product attributes",
    aiDetections: ["Missing dimensions", "Incomplete specs", "Low visibility"],
    gmcIssueType: "MISSING_ATTRIBUTES",
    issueTimestamp: "2024-01-20T09:15:00Z",
    resolutionStatus: "In Progress",
    impressionChange: -18.2,
    clickChange: -12.5,
    revenueChange: -15.8,
  },
  {
    id: "PROD-ALT-003",
    name: "Dyson V15 Detect Vacuum",
    brand: "Dyson",
    category: "Home & Garden > Appliances > Vacuum Cleaners",
    price: 649.0,
    currency: "USD",
    availability: "preorder",
    condition: "new",
    visibilityScore: 32,
    clicks: 1450,
    impressions: 22500,
    ctr: 6.44,
    cpc: 1.25,
    conversions: 95,
    revenue: 61655.0,
    roas: 4.1,
    conversionRate: 6.55,
    returnRate: 2.8,
    bounceRate: 24.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-19T14:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=60&h=60&fit=crop&crop=center",
    description: "Cordless vacuum with laser dust detection",
    gtin: "5025155123456",
    mpn: "DYS-V15-DET",
    inventoryLevel: 0,
    shippingCost: 0.0,
    color: "Yellow",
    size: "Standard",
    material: "Plastic",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Home", "Cleaning", "Cordless"],
    issues: ["Preorder status unclear", "Shipping date missing"],
    opportunities: ["Add expected ship date", "Clarify preorder terms"],
    searchImpressions: 68000,
    searchClicks: 3800,
    searchCtr: 5.59,
    searchAddToCarts: 760,
    searchPurchases: 90,
    searchConversionRate: 2.37,
    topSearchTerms: ["dyson vacuum", "v15 detect", "cordless vacuum"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "high",
    productId: "PROD-ALT-003",
    channelStatus: "Active",
    aiDiagnostic: "Preorder - missing availability details",
    aiDetections: ["Unclear preorder status", "Missing ship date", "Inventory at zero"],
    gmcIssueType: "AVAILABILITY_ISSUE",
    issueTimestamp: "2024-01-19T14:20:00Z",
    resolutionStatus: "Pending",
    impressionChange: -8.5,
    clickChange: -5.2,
    revenueChange: -6.8,
  },
  {
    id: "PROD-ALT-004",
    name: "Lululemon Align Leggings",
    brand: "Lululemon",
    category: "Apparel > Women > Activewear > Leggings",
    price: 98.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 28,
    clicks: 2850,
    impressions: 42000,
    ctr: 6.79,
    cpc: 0.65,
    conversions: 215,
    revenue: 21070.0,
    roas: 5.8,
    conversionRate: 7.54,
    returnRate: 4.2,
    bounceRate: 22.8,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T11:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=60&h=60&fit=crop&crop=center",
    description: "Buttery-soft yoga leggings with high waist",
    gtin: "6789012345678",
    mpn: "LLL-ALIGN-BLK-6",
    inventoryLevel: 185,
    shippingCost: 0.0,
    color: "Black",
    size: "6",
    material: "Nulu Fabric",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Yoga", "Activewear", "Premium"],
    issues: ["Pixelated zoom images"],
    opportunities: ["Retake high-res photos", "Add fabric detail shots"],
    searchImpressions: 125000,
    searchClicks: 7200,
    searchCtr: 5.76,
    searchAddToCarts: 1440,
    searchPurchases: 210,
    searchConversionRate: 2.92,
    topSearchTerms: ["lululemon leggings", "align leggings", "yoga pants"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-ALT-004",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Pixelated product images",
    aiDetections: ["Pixelated images", "Low resolution zoom", "Image compression issues"],
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-20T11:45:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -35.8,
    clickChange: -22.5,
    revenueChange: -28.2,
  },
  {
    id: "PROD-ALT-005",
    name: "KitchenAid Stand Mixer",
    brand: "KitchenAid",
    category: "Home & Garden > Kitchen > Mixers",
    price: 429.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 48,
    clicks: 1850,
    impressions: 28500,
    ctr: 6.49,
    cpc: 1.05,
    conversions: 125,
    revenue: 53625.0,
    roas: 4.8,
    conversionRate: 6.76,
    returnRate: 1.5,
    bounceRate: 18.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T13:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=60&h=60&fit=crop&crop=center",
    description: "Professional 5-quart stand mixer with 10 speeds",
    gtin: "8883456789012",
    mpn: "KA-SM-5QT-RED",
    inventoryLevel: 68,
    shippingCost: 0.0,
    color: "Empire Red",
    size: "5 Quart",
    material: "Metal",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Kitchen", "Baking", "Professional"],
    issues: [],
    opportunities: ["Bundle with attachments", "Highlight color options"],
    searchImpressions: 95000,
    searchClicks: 5200,
    searchCtr: 5.47,
    searchAddToCarts: 1040,
    searchPurchases: 120,
    searchConversionRate: 2.31,
    topSearchTerms: ["kitchenaid mixer", "stand mixer", "baking mixer"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "high",
    productId: "PROD-ALT-005",
    channelStatus: "Active",
    aiDiagnostic: "Strong performer - optimize for growth",
    aiDetections: ["High conversion rate", "Good visibility", "Premium product"],
    gmcIssueType: "NONE",
    issueTimestamp: "2024-01-20T13:20:00Z",
    resolutionStatus: "Approved",
    impressionChange: 18.5,
    clickChange: 15.2,
    revenueChange: 22.8,
  },
  {
    id: "PROD-ALT-006",
    name: "Patagonia Nano Puff Jacket",
    brand: "Patagonia",
    category: "Apparel > Men > Outerwear > Jackets",
    price: 249.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 22,
    clicks: 1250,
    impressions: 19800,
    ctr: 6.31,
    cpc: 0.88,
    conversions: 92,
    revenue: 22908.0,
    roas: 4.2,
    conversionRate: 7.36,
    returnRate: 2.5,
    bounceRate: 26.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T09:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=60&h=60&fit=crop&crop=center",
    description: "Lightweight insulated jacket for cold weather",
    gtin: "7890123456789",
    mpn: "PAT-NANO-BLK-M",
    inventoryLevel: 95,
    shippingCost: 0.0,
    color: "Black",
    size: "M",
    material: "Recycled Polyester",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Outdoor", "Sustainable", "Insulated"],
    issues: ["Dark product photos", "Poor color representation"],
    opportunities: ["Improve lighting", "Show color accuracy"],
    searchImpressions: 72000,
    searchClicks: 3900,
    searchCtr: 5.42,
    searchAddToCarts: 780,
    searchPurchases: 88,
    searchConversionRate: 2.26,
    topSearchTerms: ["patagonia jacket", "nano puff", "insulated jacket"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-ALT-006",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Dark and unclear product images",
    aiDetections: ["Dark images", "Poor lighting", "Color accuracy issues"],
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-20T09:30:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -38.5,
    clickChange: -25.2,
    revenueChange: -32.8,
  },
  {
    id: "PROD-ALT-007",
    name: "Instant Pot Duo Plus",
    brand: "Instant Pot",
    category: "Home & Garden > Kitchen > Pressure Cookers",
    price: 119.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 55,
    clicks: 3200,
    impressions: 48500,
    ctr: 6.6,
    cpc: 0.72,
    conversions: 245,
    revenue: 29155.0,
    roas: 5.5,
    conversionRate: 7.66,
    returnRate: 1.8,
    bounceRate: 20.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-19T08:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=60&h=60&fit=crop&crop=center",
    description: "9-in-1 programmable pressure cooker",
    gtin: "6543217890123",
    mpn: "IP-DUO-6QT",
    inventoryLevel: 215,
    shippingCost: 0.0,
    color: "Stainless Steel",
    size: "6 Quart",
    material: "Stainless Steel",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Kitchen", "Cooking", "Multi-Function"],
    issues: [],
    opportunities: ["Add recipe content", "Highlight versatility"],
    searchImpressions: 145000,
    searchClicks: 8500,
    searchCtr: 5.86,
    searchAddToCarts: 1700,
    searchPurchases: 240,
    searchConversionRate: 2.82,
    topSearchTerms: ["instant pot", "pressure cooker", "multi cooker"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "high",
    productId: "PROD-ALT-007",
    channelStatus: "Active",
    aiDiagnostic: "Excellent performance - best seller",
    aiDetections: ["High conversion rate", "Strong ROAS", "Popular product"],
    gmcIssueType: "NONE",
    issueTimestamp: "2024-01-19T08:15:00Z",
    resolutionStatus: "Approved",
    impressionChange: 25.5,
    clickChange: 20.8,
    revenueChange: 28.2,
  },
  {
    id: "PROD-ALT-008",
    name: "Yeti Rambler Tumbler",
    brand: "Yeti",
    category: "Home & Garden > Kitchen > Drinkware > Tumblers",
    price: 35.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 38,
    clicks: 2450,
    impressions: 38200,
    ctr: 6.41,
    cpc: 0.45,
    conversions: 185,
    revenue: 6475.0,
    roas: 6.2,
    conversionRate: 7.55,
    returnRate: 1.2,
    bounceRate: 22.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T10:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=60&h=60&fit=crop&crop=center",
    description: "Insulated stainless steel tumbler with lid",
    gtin: "5432178901234",
    mpn: "YETI-RAM-30-BLK",
    inventoryLevel: 325,
    shippingCost: 0.0,
    color: "Black",
    size: "30 oz",
    material: "Stainless Steel",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Drinkware", "Outdoor", "Insulated"],
    issues: ["Missing size comparison"],
    opportunities: ["Add size guide", "Show capacity comparison"],
    searchImpressions: 115000,
    searchClicks: 6800,
    searchCtr: 5.91,
    searchAddToCarts: 1360,
    searchPurchases: 180,
    searchConversionRate: 2.65,
    topSearchTerms: ["yeti tumbler", "insulated cup", "yeti rambler"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "medium",
    productId: "PROD-ALT-008",
    channelStatus: "Active",
    aiDiagnostic: "Good performance - add size guide",
    aiDetections: ["Missing size comparison", "High ROAS", "Popular item"],
    gmcIssueType: "MISSING_SIZE_INFO",
    issueTimestamp: "2024-01-20T10:45:00Z",
    resolutionStatus: "In Progress",
    impressionChange: 8.5,
    clickChange: 6.2,
    revenueChange: 10.5,
  },
  {
    id: "PROD-ALT-009",
    name: "Hydro Flask Water Bottle",
    brand: "Hydro Flask",
    category: "Sports > Outdoor > Water Bottles",
    price: 44.95,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 42,
    clicks: 2850,
    impressions: 44500,
    ctr: 6.4,
    cpc: 0.52,
    conversions: 215,
    revenue: 9664.25,
    roas: 5.8,
    conversionRate: 7.54,
    returnRate: 1.5,
    bounceRate: 19.8,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=60&h=60&fit=crop&crop=center",
    description: "Vacuum insulated water bottle keeps drinks cold 24hrs",
    gtin: "4321789012345",
    mpn: "HF-WB-32-BLUE",
    inventoryLevel: 285,
    shippingCost: 0.0,
    color: "Pacific Blue",
    size: "32 oz",
    material: "Stainless Steel",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Outdoor", "Hydration", "Insulated"],
    issues: [],
    opportunities: ["Highlight color options", "Bundle with accessories"],
    searchImpressions: 135000,
    searchClicks: 7800,
    searchCtr: 5.78,
    searchAddToCarts: 1560,
    searchPurchases: 210,
    searchConversionRate: 2.69,
    topSearchTerms: ["hydro flask", "water bottle", "insulated bottle"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "high",
    productId: "PROD-ALT-009",
    channelStatus: "Active",
    aiDiagnostic: "Strong performer - expand color range",
    aiDetections: ["High conversion rate", "Good visibility", "Popular colors"],
    gmcIssueType: "NONE",
    issueTimestamp: "2024-01-20T14:30:00Z",
    resolutionStatus: "Approved",
    impressionChange: 15.5,
    clickChange: 12.8,
    revenueChange: 18.2,
  },
  {
    id: "PROD-ALT-010",
    name: "Bose SoundLink Flex Speaker",
    brand: "Bose",
    category: "Electronics > Audio > Bluetooth Speakers",
    price: 149.0,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    visibilityScore: 15,
    clicks: 850,
    impressions: 14200,
    ctr: 5.99,
    cpc: 0.95,
    conversions: 62,
    revenue: 9238.0,
    roas: 3.8,
    conversionRate: 7.29,
    returnRate: 2.2,
    bounceRate: 32.5,
    approvalStatus: "approved",
    lastUpdated: "2024-01-20T16:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e71?w=60&h=60&fit=crop&crop=center",
    description: "Portable waterproof Bluetooth speaker",
    gtin: "3217890123456",
    mpn: "BOSE-SLF-BLK",
    inventoryLevel: 125,
    shippingCost: 0.0,
    color: "Black",
    size: "Portable",
    material: "Silicone",
    targetCountry: "US",
    feedSource: "Google Shopping",
    customLabels: ["Audio", "Portable", "Waterproof"],
    issues: ["Washed out product images", "Poor contrast"],
    opportunities: ["Retake photos with better lighting", "Show waterproof feature"],
    searchImpressions: 62000,
    searchClicks: 3400,
    searchCtr: 5.48,
    searchAddToCarts: 680,
    searchPurchases: 60,
    searchConversionRate: 1.76,
    topSearchTerms: ["bose speaker", "bluetooth speaker", "portable speaker"],
    enable_search: "yes",
    enable_checkout: "yes",
    imageQuality: "poor",
    productId: "PROD-ALT-010",
    channelStatus: "Warning",
    aiDiagnostic: "Feed issue: Washed out and low contrast images",
    aiDetections: ["Washed out images", "Poor contrast", "Low visibility score"],
    gmcIssueType: "IMAGE_QUALITY_AND_RESOLUTION",
    issueTimestamp: "2024-01-20T16:45:00Z",
    resolutionStatus: "Unresolved",
    impressionChange: -45.5,
    clickChange: -32.8,
    revenueChange: -40.2,
  },
]

for (let i = 15; i <= 500; i++) {
  const brands = ["Nike", "Adidas", "Apple", "Samsung", "Sony"]
  const categories = [
    "Footwear > Athletic Shoes",
    "Electronics > Mobile Phones",
    "Electronics > Laptops",
    "Apparel > T-Shirts",
    "Accessories > Watches",
  ]
  const colors = ["Black", "White", "Red", "Blue", "Gray"]

  // All products now have poor image quality
  const imageQuality = "poor" as const
  const channelStatus = "Warning"
  const aiDiagnostic = "Feed issue: Image Quality and Resolution"
  const gmcIssueType = "IMAGE_QUALITY_AND_RESOLUTION"
  const resolutionStatus = "Unresolved"

  // All products have negative performance changes
  const impressionChange = -40 - Math.random() * 20 // -40% to -60%
  const clickChange = -20 - Math.random() * 20 // -20% to -40%
  const revenueChange = -30 - Math.random() * 25 // -30% to -55%

  // Default AI Detections for generated products
  const aiDetections = ["Image quality issues", "Low resolution"]

  mockProducts.push({
    id: `PROD-${String(i).padStart(3, "0")}`,
    name: `Product ${i} - ${brands[i % brands.length]}`,
    brand: brands[i % brands.length],
    category: categories[i % categories.length],
    price: Math.round((50 + Math.random() * 450) * 100) / 100,
    currency: "USD",
    availability: Math.random() > 0.1 ? "in_stock" : "out_of_stock",
    condition: "new",
    visibilityScore: Math.round(15 + Math.random() * 40), // Lowered visibility for demo
    clicks: Math.round(100 + Math.random() * 3000),
    impressions: Math.round(5000 + Math.random() * 30000),
    ctr: Math.round((2 + Math.random() * 8) * 100) / 100,
    cpc: Math.round((0.3 + Math.random() * 1.2) * 100) / 100,
    conversions: Math.round(10 + Math.random() * 200),
    revenue: Math.round((1000 + Math.random() * 20000) * 100) / 100,
    roas: Math.round((2 + Math.random() * 4) * 100) / 100,
    conversionRate: Math.round((2 + Math.random() * 8) * 100) / 100,
    returnRate: Math.round(Math.random() * 8 * 100) / 100,
    bounceRate: Math.round((20 + Math.random() * 40) * 100) / 100,
    approvalStatus: Math.random() > 0.5 ? "approved" : "disapproved",
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=60&h=60&fit=crop&blur=10`,
    description: `Product description for item ${i}`,
    gtin: `${1234567890000 + i}`,
    mpn: `MPN-${i}`,
    inventoryLevel: Math.round(10 + Math.random() * 500),
    shippingCost: Math.round(Math.random() * 15 * 100) / 100,
    color: colors[i % colors.length],
    size: ["S", "M", "L", "XL"][i % 4],
    material: ["Cotton", "Synthetic", "Leather", "Metal"][i % 4],
    targetCountry: "US",
    feedSource: "Primary Feed",
    customLabels: [],
    issues: ["Image quality and resolution"], // Consistent issue for demo
    opportunities: [],
    searchImpressions: Math.round(10000 + Math.random() * 80000),
    searchClicks: Math.round(500 + Math.random() * 4000),
    searchCtr: Math.round((3 + Math.random() * 5) * 100) / 100,
    searchAddToCarts: Math.round(50 + Math.random() * 800),
    searchPurchases: Math.round(10 + Math.random() * 150),
    searchConversionRate: Math.round((1 + Math.random() * 5) * 100) / 100,
    topSearchTerms: [`product ${i}`, brands[i % brands.length].toLowerCase()],
    enable_search: Math.random() > 0.2 ? "yes" : "no",
    enable_checkout: Math.random() > 0.3 ? "yes" : "no",
    imageQuality,
    productId: `PROD-${String(i).padStart(3, "0")}`,
    channelStatus,
    aiDiagnostic,
    aiDetections, // Added AI Detections
    gmcIssueType,
    issueTimestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionStatus,
    impressionChange,
    clickChange,
    revenueChange,
  })
}

// Add some specific cases for other AI insights
for (let i = 0; i < mockProducts.length; i++) {
  // Simulate low visibility impacting performance
  if (mockProducts[i].visibilityScore < 40 && mockProducts[i].approvalStatus === "approved") {
    if (mockProducts[i].impressionChange === undefined || mockProducts[i].impressionChange > -20) {
      mockProducts[i].impressionChange = -30 - Math.random() * 20 // -30% to -50%
    }
    if (mockProducts[i].clickChange === undefined || mockProducts[i].clickChange > -10) {
      mockProducts[i].clickChange = -15 - Math.random() * 10 // -15% to -25%
    }
    if (mockProducts[i].revenueChange === undefined || mockProducts[i].revenueChange > -25) {
      mockProducts[i].revenueChange = -25 - Math.random() * 15 // -25% to -40%
    }
    mockProducts[i].causeDetected = "Low visibility score"
    mockProducts[i].changePeriod = "Last 30 days vs previous 30"
    mockProducts[i].aiDiagnostic = "Low visibility, potential for improvement"
    mockProducts[i].aiDetections = mockProducts[i].aiDetections
      ? [...mockProducts[i].aiDetections, "Low visibility score"]
      : ["Low visibility score"]
  }

  // Simulate products with zero conversions for wasted spend
  if (mockProducts[i].conversions === 0 && mockProducts[i].clicks > 100) {
    if (mockProducts[i].impressionChange === undefined || mockProducts[i].impressionChange > -10) {
      mockProducts[i].impressionChange = -10 - Math.random() * 5
    }
    if (mockProducts[i].clickChange === undefined || mockProducts[i].clickChange > -5) {
      mockProducts[i].clickChange = -5 - Math.random() * 5
    }
    if (mockProducts[i].revenueChange === undefined || mockProducts[i].revenueChange > -15) {
      mockProducts[i].revenueChange = -15 - Math.random() * 10
    }
    mockProducts[i].causeDetected = "Wasted ad spend (no conversions)"
    mockProducts[i].aiDiagnostic = "High spend, zero conversions"
    mockProducts[i].aiDetections = mockProducts[i].aiDetections
      ? [...mockProducts[i].aiDetections, "Zero conversions"]
      : ["Zero conversions"]
  }

  // Ensure AI Detections is an array, even if empty, for all products
  if (!mockProducts[i].aiDetections) {
    mockProducts[i].aiDetections = []
  }
}

interface SavedSegment {
  id: string
  name: string
  description: string
  filters: any[]
  timeRange: string
  createdAt: string
  productCount: number
  updatedAt?: string // Added for new segment structure
}

// Helper function to get product value - moved before component to fix initialization error
const getProductValue = (product: Product, field: string): any => {
  const fieldMapping: Record<string, keyof Product | string> = {
    productId: "id",
    product: "name",
    thumbnail: "imageUrl",
    channelStatus: "channelStatus",
    aiDiagnostic: "aiDiagnostic",
    aiDetections: "aiDetections", // Added for new field
    imageQuality: "imageQuality",
    impressionChange: "impressionChange",
    visibility: "visibilityScore",
    clickChange: "clickChange",
    ctr: "ctr",
    revenueChange: "revenueChange",
    gmcIssueType: "gmcIssueType",
    issueTimestamp: "issueTimestamp",
    resolutionStatus: "resolutionStatus",
    brand: "brand",
    category: "category",
    color: "color",
    size: "size",
    material: "material",
    price: "price",
    availability: "availability",
    condition: "condition",
    inventoryLevel: "inventoryLevel",
    impressions: "impressions",
    clicks: "clicks",
    cpc: "cpc",
    conversions: "conversions",
    roas: "roas",
    conversionRate: "conversionRate",
    revenue: "revenue",
    bounceRate: "bounceRate",
    returnRate: "returnRate",
    approvalStatus: "approvalStatus",
    searchImpressions: "searchImpressions",
    searchClicks: "searchClicks",
    searchCtr: "searchCtr",
    searchAddToCarts: "searchAddToCarts",
    searchPurchases: "searchPurchases",
    searchConversionRate: "searchConversionRate",
    topSearchTerms: "topSearchTerms",
    enable_search: "enable_search",
    enable_checkout: "enable_checkout",
    changePercent: "changePercent", // Added for new fields
    direction: "direction", // Added for new fields
    causeDriver: "causeDriver", // Added for new fields
    channelImpact: "channelImpact", // Added for new fields
    causeDetected: "causeDetected",
    changePeriod: "changePeriod",
    feedSource: "feedSource",
    // </CHANGE>
  }

  const productField = fieldMapping[field] as keyof Product | undefined
  if (productField && product[productField] !== undefined) {
    if (field === "topSearchTerms" && Array.isArray(product[productField])) {
      return (product[productField] as string[]).join(", ")
    }
    if (field === "aiDetections" && Array.isArray(product[productField])) {
      return (product[productField] as string[]).join(", ") // Join AI Detections into a string
    }
    if (field === "enable_search" || field === "enable_checkout") {
      return product[productField] === "yes"
    }
    if (field === "impressionChange" || field === "clickChange" || field === "revenueChange") {
      // Return the percentage value directly for these fields
      return product[productField]
    }
    if (field === "changePeriod") {
      return product[productField]
    }
    if (field === "causeDetected") {
      return product[productField]
    }

    return product[productField]
  }

  if (field === "season") {
    const labels = product.customLabels || []
    if (labels.includes("Winter")) return "Winter"
    if (labels.includes("Summer")) return "Summer"
    if (labels.includes("Spring")) return "Spring"
    if (labels.includes("Fall")) return "Fall"
    return "All Season"
  }

  switch (field) {
    case "sessions":
      return Math.floor(product.impressions * 0.1)
    case "pageviews":
      return Math.floor(product.impressions * 0.12)
    case "addToCart":
      return Math.floor(product.conversions * 1.5)
    default:
      return ""
  }
}

// Helper function to evaluate filters
const evaluateFilter = (productValue: any, operator: string, filterValue: string | string[], type: string): boolean => {
  switch (operator) {
    case "contains":
      if (productValue === undefined || productValue === null) return false
      // Handle array check for aiDetections
      if (Array.isArray(productValue)) {
        return productValue.some((item) => String(item).toLowerCase().includes(String(filterValue).toLowerCase()))
      }
      return String(productValue).toLowerCase().includes(String(filterValue).toLowerCase())
    case "equals":
      if (productValue === undefined || productValue === null) return false
      // For boolean-like fields, direct comparison is needed
      if (type === "boolean") {
        return productValue === filterValue
      }
      return String(productValue).toLowerCase() === String(filterValue).toLowerCase()
    case "not_contains":
      if (productValue === undefined || productValue === null) return true
      // Handle array check for aiDetections
      if (Array.isArray(productValue)) {
        return !productValue.some((item) => String(item).toLowerCase().includes(String(filterValue).toLowerCase()))
      }
      return !String(productValue).toLowerCase().includes(String(filterValue).toLowerCase())
    case "is":
      return productValue === filterValue
    case "is_not":
      return productValue !== filterValue
    case "in":
      if (productValue === undefined || productValue === null) return false
      if (Array.isArray(filterValue)) {
        return filterValue.includes(String(productValue))
      }
      return String(filterValue)
        .split(",")
        .map((v) => v.trim())
        .includes(String(productValue))
    case "greater_than":
      return Number(productValue) > Number(filterValue)
    case "less_than":
      return Number(productValue) < Number(filterValue)
    case "between":
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const num = Number(productValue)
        return num >= Number(filterValue[0]) && num <= Number(filterValue[1])
      }
      return false
    case "less_than_or_equal": // Added for new filter type
      return Number(productValue) <= Number(filterValue)
    case "greater_than_or_equal": // Added for new filter type
      return Number(productValue) >= Number(filterValue)
    default:
      return true
  }
}
// STEP 5: helper to summarise BigQuery data
function getDiagnoseSummary(diagnoseData: any[]) {
  if (!diagnoseData || diagnoseData.length === 0) {
    return {
      totalImpressions: 0,
      totalClicks: 0,
      totalCost: 0,
      totalRevenue: 0,
    }
  }

  return diagnoseData.reduce(
    (acc, row) => ({
      totalImpressions: acc.totalImpressions + (row.impressions || 0),
      totalClicks: acc.totalClicks + (row.clicks || 0),
      totalCost: acc.totalCost + (row.cost || 0),
      totalRevenue: acc.totalRevenue + (row.revenue || 0),
    }),
    { totalImpressions: 0, totalClicks: 0, totalCost: 0, totalRevenue: 0 },
  )
}
function getVisibilityIndex(diagnoseData: any[]) { 
  if (!diagnoseData || diagnoseData.length === 0) return 0;

  let totalImpressions = 0;
  let totalClicks = 0;

  diagnoseData.forEach(row => {
    totalImpressions += row.impressions || 0;
    totalClicks += row.clicks || 0;
  });

  if (totalImpressions === 0) return 0;

  return Math.round((totalClicks / totalImpressions) * 100);
}

export default function DiagnosePage() {
// --- BIGQUERY DIAGNOSE DATA ---
const [diagnoseData, setDiagnoseData] = useState([])
const summary = getDiagnoseSummary(diagnoseData);
const visibilityIndex = getVisibilityIndex(diagnoseData);


useEffect(() => {
  async function loadDiagnose() {
    try {
      const res = await fetch("/api/diagnose")
      const json = await res.json()
      console.log("Diagnose API data:", json)
      setDiagnoseData(json)
    } catch (err) {
      console.error("Failed to load diagnose data", err)
    }
  }
  loadDiagnose()
}, [])

  // Initialize router
  const router = useRouter()
  const [useAlternateProducts, setUseAlternateProducts] = useState(false)

  const currentMockProducts = useAlternateProducts ? alternateProducts : mockProducts

  // Add Algolia Search Intelligence data to products
  const productsWithSearchData = addAlgoliaSearchData(currentMockProducts)

  const [products, setProducts] = useState<Product[]>(productsWithSearchData)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsWithSearchData)

  useEffect(() => {
    const currentMockProducts = useAlternateProducts ? alternateProducts : mockProducts
    const productsWithSearchData = addAlgoliaSearchData(currentMockProducts)
    setProducts(productsWithSearchData)
    setFilteredProducts(productsWithSearchData)
  }, [useAlternateProducts])

  // Demo segment that loads automatically
  useEffect(() => {
    // Don't auto-load any segment - show all products by default
    // Users can create their own segments using the segment builder
    setFilteredProducts(products)
  }, [products])

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [showWizard, setShowWizard] = useState(false)
  const [viewMode, setViewMode] = useState<"product" | "pivot">("product")
  const [pivotMode, setPivotMode] = useState(false)
  const [pivotDimensions, setPivotDimensions] = useState<string[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [aiQuery, setAiQuery] = useState("")
  const [aiResults, setAiResults] = useState<Product[]>([])
  const [showAiResults, setShowAiResults] = useState(false)
  const [timeframe, setTimeframe] = useState("14")
  const [pivotLevels, setPivotLevels] = useState<string[]>(["brand"])
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([])
  const [activeSegment, setActiveSegment] = useState<SavedSegment | null>(null)
  const [segmentProducts, setSegmentProducts] = useState<Product[]>([])
  const [feedHealthDrillDown, setFeedHealthDrillDown] = useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    availableColumns.filter((col) => col.default).map((col) => col.key),
  )

  const [isSegmentBuilderCollapsed, setIsSegmentBuilderCollapsed] = useState(true)
  const [isGraphCollapsed, setIsGraphCollapsed] = useState(false)
  const [isProductViewerCollapsed, setIsProductViewerCollapsed] = useState(false)
  // Added state for Performance Trends graph collapse
  const [isPerformanceTrendsCollapsed, setIsPerformanceTrendsCollapsed] = useState(false)

  // Add column search state
  const [columnSearchTerm, setColumnSearchTerm] = useState("")

  // Add main dashboard date range state
  const [dashboardDateRange, setDashboardDateRange] = useState("30")

  // Add upgrade dialog state
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [showAllSignals, setShowAllSignals] = useState(false)
  const [selectedInsightConfig, setSelectedInsightConfig] = useState<{
    channel: string
    metrics: string[]
  } | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSegmentExpanded, setIsSegmentExpanded] = useState(false)
  const [visibilityIndexClicked, setVisibilityIndexClicked] = useState(false) // New state for visibility index click

  // Add pivot dimension options
  const pivotableFields = [
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "color", label: "Color" },
    { key: "size", label: "Size" },
    { key: "material", label: "Material" },
    { key: "condition", label: "Condition" },
    { key: "approvalStatus", label: "Approval Status" },
    { key: "feedSource", label: "Feed Source" },
    { key: "targetCountry", label: "Target Country" },
    { key: "imageQuality", label: "Image Quality" }, // Added for new field
    { key: "enable_search", label: "Enable Search" }, // Added for new field
    { key: "enable_checkout", label: "Enable Checkout" }, // Added for new field
    { key: "aiDiagnostic", label: "AI Diagnostic" }, // Added for new field
    { key: "gmcIssueType", label: "GMC Issue Type" }, // Added for new field
    { key: "resolutionStatus", label: "Resolution Status" }, // Added for new field
    { key: "aiDetections", label: "AI Detections" }, // Added for new field
  ]

  // NOTE: This SegmentFilter interface is inferred based on usage in SegmentBuilder
  interface SegmentFilter {
    id?: string // Assuming id might be present from SegmentBuilder
    field: string
    operator: string
    value: string | string[]
    type: string
    category?: string // Assuming category might be present from SegmentBuilder
    label?: string // Assuming label might be present from SegmentBuilder
    options?: string[] // Assuming options might be present from SegmentBuilder
  }

  const applySegmentFilters = (products: Product[], filters: SegmentFilter[]): Product[] => {
    const filtered = products.filter((product) => {
      return filters.every((filter) => {
        const productValue = getProductValue(product, filter.field)
        // Ensure filter.value is correctly passed to evaluateFilter, handling potential string type for numbers
        const filterValueForEvaluation = filter.type === "numeric" ? String(filter.value) : filter.value
        const result = evaluateFilter(productValue, filter.operator, filterValueForEvaluation, filter.type)
        return result
      })
    })

    return filtered
  }

  const handleSegmentSaved = (segment: SavedSegment) => {
    setSavedSegments((prev) => [...prev, segment])
  }

  const handleAIInsightAction = (actionType: string, actionData?: any) => {
    if (actionType === "image_quality_issues") {
      const imageQualitySegment: SavedSegment = {
        id: "ai-generated-image-quality",
        name: "Image Quality Issues - Google Shopping",
        description: "Products with poor image quality affecting Google Shopping performance",
        filters: [
          {
            id: "filter-1",
            category: "performance",
            field: "impressionChange",
            label: "Impression Change %",
            type: "numeric", // Changed type to numeric
            operator: "less_equal", // Changed operator to less_equal
            value: "-40", // Changed value to string to match numeric type and operator
            options: [],
          },
          {
            id: "filter-2",
            category: "performance",
            field: "clickChange",
            label: "Click Change %",
            type: "numeric", // Changed type to numeric
            operator: "less_equal", // Changed operator to less_equal
            value: "-20", // Changed value to string to match numeric type and operator
            options: [],
          },
          {
            id: "filter-3",
            category: "aiDiagnostics", // Changed category from "ai" to "aiDiagnostics"
            field: "aiDetections", // Changed field to aiDetections
            label: "AI Detections",
            type: "enum", // Type is enum for contains/not_contains on array string representation
            operator: "contains", // Operator is 'contains' for checking array content
            value: "Image quality issues", // Value to search for within the array
            options: ["Image quality issues", "Low resolution", "Budget issue", "Competition", "Seasonality"],
          },
          {
            id: "filter-4",
            category: "feed",
            field: "imageQuality",
            label: "Image Quality / Availability",
            type: "enum",
            operator: "is", // Changed operator to is
            value: "Poor",
            options: ["High", "Medium", "Poor", "Missing"],
          },
          {
            id: "filter-5",
            category: "channel", // Category is now "channel" (matches segment-builder)
            field: "feedSource",
            label: "Source Channel",
            type: "enum",
            operator: "is", // Changed operator to is
            value: "Google Shopping",
            options: ["Google Shopping", "Meta", "TikTok", "Pinterest", "Amazon"],
          },
          {
            id: "filter-6",
            category: "dateRange", // Changed category from "time" to "dateRange"
            field: "changePeriod",
            label: "Change Period",
            type: "enum",
            operator: "is", // Changed operator to is
            value: "Last 30 days vs previous 30",
            options: ["Last 7 days", "Last 30 days vs previous 30", "Last 90 days"],
          },
        ],
        timeRange: "30",
        createdAt: new Date().toISOString(),
        productCount: 0, // Will be updated after filtering
      }

      setActiveSegment(imageQualitySegment)
      const filtered = applySegmentFilters(products, imageQualitySegment.filters)
      imageQualitySegment.productCount = filtered.length
      setSegmentProducts(filtered)
      setFilteredProducts(filtered)
      setIsSegmentBuilderCollapsed(false)

      setInsightTrigger({ channel: "google", metrics: ["impressions", "visibility"] })

      setTimeout(() => {
        const graphElement = document.querySelector("[data-graph-container]")
        if (graphElement) {
          graphElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }

        setTimeout(() => {
          const segmentElement = document.querySelector("[data-segment-builder]")
          if (segmentElement) {
            segmentElement.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 800)
      }, 100)
    } else if (actionType === "google_lost_impressions") {
      const googleImpressionsSegment: SavedSegment = {
        id: "ai-generated-google-impressions",
        name: "Google Shopping - Lost Impressions Analysis",
        description: "Products with low visibility scores affecting Google Shopping impression performance",
        filters: [
          {
            id: "filter-1",
            category: "performance",
            field: "visibilityScore",
            label: "Visibility Score",
            type: "numeric",
            operator: "less_than",
            value: "70",
            options: [],
          },
        ],
        timeRange: "30",
        createdAt: new Date().toISOString(),
        productCount: 0, // Will be updated after filtering
      }

      setActiveSegment(googleImpressionsSegment)
      const filtered = applySegmentFilters(products, googleImpressionsSegment.filters)
      googleImpressionsSegment.productCount = filtered.length
      setSegmentProducts(filtered)
      setFilteredProducts(filtered)
      setIsSegmentBuilderCollapsed(false)

      setTimeout(() => {
        const segmentElement = document.querySelector("[data-segment-builder]")
        if (segmentElement) {
          segmentElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } else if (actionType === "recoverable_revenue") {
      const recoverableRevenueSegment: SavedSegment = {
        id: "ai-generated-recoverable-revenue",
        name: "Hidden Products - Revenue Recovery",
        description: "Disapproved or hidden products with potential revenue if reapproved and optimized",
        filters: [
          {
            id: "filter-1",
            category: "feed",
            field: "approvalStatus",
            label: "Approval Status",
            type: "enum",
            operator: "in",
            value: ["Disapproved", "Pending"],
            options: ["Approved", "Disapproved", "Pending", "Under Review"],
          },
        ],
        timeRange: "30",
        createdAt: new Date().toISOString(),
        productCount: 0, // Will be updated after filtering
      }

      setActiveSegment(recoverableRevenueSegment)
      const filtered = applySegmentFilters(products, recoverableRevenueSegment.filters)
      recoverableRevenueSegment.productCount = filtered.length
      setSegmentProducts(filtered)
      setFilteredProducts(filtered)
      setIsSegmentBuilderCollapsed(false)

      setTimeout(() => {
        const segmentElement = document.querySelector("[data-segment-builder]")
        if (segmentElement) {
          segmentElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
    // Add more action handlers for other insights as needed
  }

  const insightConfigs = [
    {
      text: "Efficiency trending up — Meta driving +12% ROI increase this week.",
      borderColor: "border-[#4F7FFF]",
      channel: "meta",
      metrics: ["roi", "roas"],
      onClickAction: () => handleAIInsightAction("efficiency_meta"), // Example action
    },
    {
      text: "Spend shift: TikTok gaining share, ROAS stable.",
      borderColor: "border-[#1DBF73]",
      channel: "tiktok",
      metrics: ["roas", "revenue"],
      onClickAction: () => handleAIInsightAction("spend_shift_tiktok"), // Example action
    },
    {
      text: "Google shopping responsible for 78% of lost impressions",
      borderColor: "border-[#F59E0B]",
      channel: "google",
      metrics: ["impressions", "visibility"],
      onClickAction: () => handleAIInsightAction("google_lost_impressions"), // Example action
    },
    {
      text: "£6.4k recoverable if hidden products reapproved.",
      borderColor: "border-[#FF5C5C]",
      channel: null, // No channel for this insight
      metrics: [],
      onClickAction: () => handleAIInsightAction("recoverable_revenue"), // Example action
    },
    {
      text: "Variance down 6% — performance becoming more consistent.",
      borderColor: "border-[#8B5CF6]",
      channel: null, // No channel for this insight
      metrics: [],
      onClickAction: () => handleAIInsightAction("performance_consistency"), // Example action
    },
    {
      text: "Amazon conversion rate up 8% — product pages optimized.",
      borderColor: "border-[#FF9900]",
      channel: "amazon",
      metrics: ["conversion", "revenue"],
      onClickAction: () => handleAIInsightAction("amazon_conversion"),
    },
    {
      text: "Instagram engagement +15% — visual content resonating.",
      borderColor: "border-[#E4405F]",
      channel: "instagram",
      metrics: ["engagement", "clicks"],
      onClickAction: () => handleAIInsightAction("instagram_engagement"),
    },
    {
      text: "Pinterest traffic surge — seasonal trend detected.",
      borderColor: "border-[#E60023]",
      channel: "pinterest",
      metrics: ["traffic", "impressions"],
      onClickAction: () => handleAIInsightAction("pinterest_traffic"),
    },
    {
      text: "YouTube video ads driving 22% more qualified leads.",
      borderColor: "border-[#FF0000]",
      channel: "youtube",
      metrics: ["leads", "conversion"],
      onClickAction: () => handleAIInsightAction("youtube_leads"),
    },
    {
      text: "LinkedIn B2B campaigns showing 18% higher CTR.",
      borderColor: "border-[#0077B5]",
      channel: "linkedin",
      metrics: ["ctr", "clicks"],
      onClickAction: () => handleAIInsightAction("linkedin_ctr"),
    },
  ]

  const displayedSignals = showAllSignals ? insightConfigs : insightConfigs.slice(0, 5)

  // State for triggering graph update based on AI insight click
  const [insightTrigger, setInsightTrigger] = useState<{
    channel: string
    metrics: string[]
  } | null>(null)

  // Filter products based on search and filters
  useEffect(() => {
    let currentProducts = products

    // Apply active segment filters if a segment is active
    if (activeSegment) {
      currentProducts =
        segmentProducts.length > 0 ? segmentProducts : applySegmentFilters(products, activeSegment.filters)
      setFilteredProducts(currentProducts)
    } else if (showAiResults) {
      currentProducts = aiResults
    } else {
      currentProducts = products
    }

    let filtered = currentProducts

    if (searchTerm && !showAiResults && !activeSegment) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.aiDetections &&
            product.aiDetections.some((detection) => detection.toLowerCase().includes(searchTerm.toLowerCase()))), // Include AI Detections in search
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => product.approvalStatus === selectedStatus)
    }

    if (selectedVisibility !== "all") {
      if (selectedVisibility === "high") {
        filtered = filtered.filter((product) => product.visibilityScore >= 70)
      } else if (selectedVisibility === "medium") {
        filtered = filtered.filter((product) => product.visibilityScore >= 40 && product.visibilityScore < 70)
      } else if (selectedVisibility === "low") {
        filtered = filtered.filter((product) => product.visibilityScore < 40)
      }
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    setFilteredProducts(filtered)
  }, [
    products,
    segmentProducts,
    activeSegment,
    searchTerm,
    selectedStatus,
    selectedVisibility,
    selectedBrand,
    aiResults,
    showAiResults,
  ])

  const handleProductSelect = (product: Product, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, product])
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts)
    } else {
      setSelectedProducts([])
    }
  }

  const proceedToOptimize = () => {
    localStorage.setItem("selectedProducts", JSON.JSON.stringify(selectedProducts))
    router.push("/products")
  }

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((key) => key !== columnKey) : [...prev, columnKey],
    )
  }

  const getVisibilityBadge = (score: number) => {
    if (score >= 70) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">High</Badge>
    } else if (score >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Low</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "disapproved":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStockBadge = (availability: string, inventoryLevel: number) => {
    if (availability === "out_of_stock") {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (inventoryLevel < 50) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          Low Stock ({inventoryLevel})
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          In Stock ({inventoryLevel})
        </Badge>
      )
    }
  }

  const brands = [...new Set(products.map((p) => p.brand))]

  // Filter columns based on search term
  const filteredColumns = availableColumns.filter(
    (column) =>
      column.label.toLowerCase().includes(columnSearchTerm.toLowerCase()) ||
      column.category.toLowerCase().includes(columnSearchTerm.toLowerCase()),
  )

  // Group filtered columns by category
  const groupedFilteredColumns = filteredColumns.reduce(
    (acc, col) => {
      if (!acc[col.category]) acc[col.category] = []
      acc[col.category].push(col)
      return acc
    },
    {} as Record<string, typeof availableColumns>,
  )

  const PivotTable = ({ products, dimensions, expandedRows, setExpandedRows }) => {
    if (dimensions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Select grouping dimensions to view pivot table</p>
        </div>
      )
    }

    // Create pivot data structure
    const createPivotData = (products, dimensions, level = 0) => {
      if (level >= dimensions.length) return products

      const dimension = dimensions[level]
      const grouped = products.reduce((acc, product) => {
        const key = getProductValue(product, dimension) || "Unknown" // Handle undefined values
        if (!acc[key]) acc[key] = []
        acc[key].push(product)
        return acc
      }, {})

      return Object.entries(grouped).map(([key, items]) => ({
        key,
        dimension,
        level,
        items: level === dimensions.length - 1 ? items : createPivotData(items, dimensions, level + 1),
        metrics: {
          count: items.length,
          totalRevenue: items.reduce((sum, p) => sum + p.revenue, 0),
          totalImpressions: items.reduce((sum, p) => sum + p.impressions, 0),
          totalClicks: items.reduce((sum, p) => sum + p.clicks, 0),
          avgVisibility: items.reduce((sum, p) => sum + p.visibilityScore, 0) / items.length,
          avgCPC:
            items.filter((p) => p.cpc > 0).reduce((sum, p) => sum + p.cpc, 0) / items.filter((p) => p.cpc > 0).length ||
            0,
          totalConversions: items.reduce((sum, p) => sum + p.conversions, 0),
        },
      }))
    }

    const pivotData = createPivotData(products, dimensions)

    const renderPivotRow = (item, depth = 0) => {
      const rowKey = `${item.dimension}-${item.key}-${depth}`
      const isExpanded = expandedRows.has(rowKey)
      const hasChildren =
        Array.isArray(item.items) &&
        item.items.length > 0 &&
        typeof item.items[0] === "object" &&
        "dimension" in item.items[0]

      // Check if this is a leaf node with actual products
      const isLeafWithProducts =
        Array.isArray(item.items) && item.items.length > 0 && typeof item.items[0] === "object" && "id" in item.items[0] // This means it's a Product object

      return (
        <React.Fragment key={rowKey}>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3" style={{ paddingLeft: `${depth * 20 + 12}px` }}>
              <div className="flex items-center space-x-2">
                {(hasChildren || isLeafWithProducts) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const newExpanded = new Set(expandedRows)
                      if (isExpanded) {
                        newExpanded.delete(rowKey)
                      } else {
                        newExpanded.add(rowKey)
                      }
                      setExpandedRows(newExpanded)
                    }}
                  >
                    {isExpanded ? "−" : "+"}
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {item.key}
                </Badge>
                <span className="text-xs text-gray-500">({item.metrics.count} products)</span>
              </div>
            </td>
            <td className="py-2 px-3 text-sm">${item.metrics.totalRevenue.toLocaleString()}</td>
            <td className="py-2 px-3 text-sm">{item.metrics.totalImpressions.toLocaleString()}</td>
            <td className="py-2 px-3 text-sm">{item.metrics.totalClicks.toLocaleString()}</td>
            <td className="py-2 px-3 text-sm">{item.metrics.totalConversions.toLocaleString()}</td>
            <td className="py-2 px-3 text-sm">{item.metrics.avgVisibility.toFixed(1)}%</td>
            <td className="py-2 px-3 text-sm">${item.metrics.avgCPC.toFixed(2)}</td>
          </tr>

          {/* Render child groups */}
          {hasChildren && isExpanded && item.items.map((childItem) => renderPivotRow(childItem, depth + 1))}

          {/* Render individual products at leaf level */}
          {isLeafWithProducts &&
            isExpanded &&
            item.items.map((product) => (
              <tr key={`product-${product.id}`} className="border-b border-gray-50 hover:bg-gray-25 bg-blue-25">
                <td className="py-2 px-3" style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-6 h-6 rounded object-cover bg-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement("div")
                          fallback.className =
                            "w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600"
                          fallback.textContent = product.brand.charAt(0)
                          parent.insertBefore(fallback, target)
                        }
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs truncate max-w-[150px]" title={product.name}>
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400">{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm">${product.revenue.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm">{product.impressions.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm">{product.clicks.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm">{product.conversions.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm">{product.visibilityScore.toFixed(1)}%</td>
                <td className="py-2 px-3 text-sm">${product.cpc.toFixed(2)}</td>
              </tr>
            ))}
        </React.Fragment>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-2 px-3 font-medium text-sm">Group</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Revenue</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Impressions</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Clicks</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Conversions</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Avg Visibility</th>
              <th className="text-left py-2 px-3 font-medium text-sm">Avg CPC</th>
            </tr>
          </thead>
          <tbody>{pivotData.map((item) => renderPivotRow(item))}</tbody>
        </table>
      </div>
    )
  }

  // Function to handle visibility index click
  const handleVisibilityIndexClick = () => {
    setVisibilityIndexClicked(true)
    setActiveTab("overview") // Ensure overview tab is active

    // Create segment with AI-driven filters
    const newSegment: SavedSegment = {
      id: `segment-${Date.now()}`,
      name: "Google Shopping - Image Quality Issues",
      description: "Products affected by image quality degradation on Google Shopping",
      filters: [
        {
          id: "filter-1",
          category: "performance",
          field: "impressionChange",
          label: "Impression Change %",
          type: "numeric",
          operator: "less_equal",
          value: "-40",
        },
        {
          id: "filter-2",
          category: "performance",
          field: "clickChange",
          label: "Click Change %",
          type: "numeric",
          operator: "less_equal",
          value: "-20",
        },
        {
          id: "filter-3",
          category: "aiDiagnostics",
          field: "aiDetections", // Targeting aiDetections
          label: "AI Detections",
          type: "enum",
          operator: "contains", // Operator to check if array contains the value
          value: "Image quality issues", // Value to search for
        },
        {
          id: "filter-4",
          category: "feed",
          field: "imageQuality",
          label: "Image Quality",
          type: "enum",
          operator: "is",
          value: "Poor",
        },
        {
          id: "filter-5",
          category: "channel",
          field: "feedSource",
          label: "Source Channel",
          type: "enum",
          operator: "is",
          value: "Google Shopping",
        },
        {
          id: "filter-6",
          category: "dateRange",
          field: "changePeriod",
          label: "Change Period",
          type: "enum",
          operator: "is",
          value: "Last 30 days vs previous 30",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // productCount will be calculated after filtering
      productCount: 0,
    }

    setActiveSegment(newSegment)
    setIsSegmentBuilderCollapsed(false) // Use the correct state variable to expand segment builder

    // Apply filters to products
    const filtered = applySegmentFilters(products, newSegment.filters)
    setSegmentProducts(filtered) // Update segmentProducts state
    setFilteredProducts(filtered) // Update filteredProducts state

    setTimeout(() => {
      const graphContainer = document.querySelector("[data-graph-container]")
      if (graphContainer) {
        graphContainer.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

 return (
  <div className="bg-white">   

{/* TEMP: show summary */}
<div className="bg-green-600 text-white p-4 mb-4 rounded">
  <div>Total Impressions: {summary.totalImpressions}</div>
  <div>Total Clicks: {summary.totalClicks}</div>
  <div>Total Cost: £{summary.totalCost}</div>
  <div>Total Revenue: £{summary.totalRevenue}</div>
</div>


      <div className="flex items-center justify-between px-8 py-6 border-b border-[#E7E7E9]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Channel Diagnostics</h2>
          <p className="text-muted-foreground mt-1">
            Phase 1 — Detect performance shifts and identify anomalies across channels.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Dashboard Dates:</Label>
          <Select value={dashboardDateRange} onValueChange={setDashboardDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-8">
        <TabsList className="mt-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="search-optimizer">Search Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-8">
          {/* Channel Overview - 4 KPI Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Channel Efficiency Card */}
            <Card className="relative rounded-xl border border-[#E7E7E9] shadow-[0_2px_4px_rgba(0,0,0,0.03)] bg-[#F4F7FF] min-h-[230px] flex flex-col">
              {/* Thin top accent bar - 6px */}
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#2A66FF]" />

              <CardContent className="py-[14px] px-[18px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-h-[44px]">
                    <TrendingUp className="w-5 h-5 text-[#2A66FF]" />
                    <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#444]">
                      Channel Efficiency
                    </div>
                    <div className="relative">
                      <Info
                        className="w-[15px] h-[15px] text-[#A7A7A7] cursor-help"
                        onMouseEnter={() => setActiveTooltip("efficiency")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "efficiency" && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] w-[240px] bg-white rounded-lg shadow-lg p-3 text-[12px] text-[#333] leading-relaxed animate-in fade-in duration-300">
                          Measures how effectively each channel turns spend into visible revenue.
                          <div className="mt-2 text-[11px] text-[#666]">
                            Formula: (Attributed Revenue ÷ Total Ad Spend) × Visibility Score.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KPI value - 4px gap from title */}
                  <div className="space-y-0.5">
                    <div className="text-[26px] font-semibold text-[#1B1B1B] leading-[1.1]">4.3x</div>
                    {/* 2px gap to label */}
                    <div className="text-[12px] text-[#6A6A6A]">Avg ROAS</div>
                    {/* Subtext */}
                    <div className="text-[11px] text-[#7C7C7C]">+9% vs last 30 days</div>
                  </div>
                </div>

                {/* Buttons - aligned to bottom */}
                <div className="flex gap-1.5 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#2A66FF] text-[#2A66FF] bg-transparent hover:bg-[#E9F1FF] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    View Trends
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#2A66FF] text-[#2A66FF] bg-transparent hover:bg-[#E9F1FF] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Compare
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Spend Distribution Card */}
            <Card className="relative rounded-xl border border-[#E7E7E9] shadow-[0_2px_4px_rgba(0,0,0,0.03)] bg-[#F2FBF6] min-h-[230px] flex flex-col">
              {/* Thin top accent bar - 6px */}
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#1DBF73]" />

              <CardContent className="py-[14px] px-[18px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-h-[44px]">
                    <PieChart className="w-5 h-5 text-[#1DBF73]" />
                    <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#444]">
                      Spend Distribution
                    </div>
                    <div className="relative">
                      <Info
                        className="w-[15px] h-[15px] text-[#A7A7A7] cursor-help"
                        onMouseEnter={() => setActiveTooltip("spend")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "spend" && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] w-[240px] bg-white rounded-lg shadow-lg p-3 text-[12px] text-[#333] leading-relaxed animate-in fade-in duration-300">
                          Shows how ad spend is split across active channels.
                          <div className="mt-2 text-[11px] text-[#666]">
                            Formula: (Channel Spend ÷ Total Spend) × 100.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KPI value - 4px gap from title */}
                  <div className="space-y-0.5">
                    <div className="text-[26px] font-semibold text-[#1B1B1B] leading-[1.1]">£68.2k</div>
                    {/* 2px gap to label */}
                    <div className="text-[12px] text-[#6A6A6A]">Total Spend</div>
                    {/* Subtext */}
                    <div className="text-[11px] text-[#7C7C7C]">Meta 42% | Google 31% | TikTok 18%</div>
                  </div>
                </div>

                {/* Buttons - aligned to bottom */}
                <div className="flex gap-1.5 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#1DBF73] text-[#1DBF73] bg-transparent hover:bg-[#E6F9F1] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    View Allocation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#1DBF73] text-[#1DBF73] bg-transparent hover:bg-[#E6F9F1] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visibility Index Card */}
            <Card
              className="relative rounded-xl border border-[#E7E7E9] shadow-[0_2px_4px_rgba(0,0,0,0.03)] bg-[#FFF8EE] min-h-[230px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={handleVisibilityIndexClick}
            >
              {/* Thin top accent bar - 6px */}
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#F6A800]" />

              <CardContent className="py-[14px] px-[18px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-h-[44px]">
                    <Eye className="w-5 h-5 text-[#F6A800]" />
                    <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#444]">
                      Visibility Index
                    </div>
                    <div className="relative">
                      <Info
                        className="w-[15px] h-[15px] text-[#A7A7A7] cursor-help"
                        onMouseEnter={() => setActiveTooltip("visibility")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "visibility" && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] w-[240px] bg-white rounded-lg shadow-lg p-3 text-[12px] text-[#333] leading-relaxed animate-in fade-in duration-300">
                          Represents % of products approved and visible on channels.
                          <div className="mt-2 text-[11px] text-[#666]">
                            Formula: (Approved + Active Products ÷ Total Products) × 100.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KPI value - 4px gap from title */}
                  <div className="space-y-0.5">
                    <div className="text-[26px] font-semibold text-[#1B1B1B] leading-[1.1]">
  {visibilityIndex}%
</div>

                    <div className="text-[12px] text-[#6A6A6A]">Visible Products</div>
                    {/* Subtext */}
                    <div className="text-[11px] text-[#7C7C7C]">2,847 of 4,450 products live</div>
                    <div className="text-[11px] text-[#DC2626]">-5% vs last 30 days</div>
                  </div>
                </div>

                {/* Buttons - aligned to bottom */}
                <div className="flex gap-1.5 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#F6A800] text-[#F6A800] bg-transparent hover:bg-[#FFF7E0] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Coverage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#F6A800] text-[#F6A800] bg-transparent hover:bg-[#FFF7E0] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Health
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Opportunity Card */}
            <Card className="relative rounded-xl border border-[#E7E7E9] shadow-[0_2px_4px_rgba(0,0,0,0.03)] bg-[#FFF1F2] min-h-[230px] flex flex-col">
              {/* Thin top accent bar - 6px */}
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#FF5C5C]" />

              <CardContent className="py-[14px] px-[18px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-h-[44px]">
                    <Target className="w-5 h-5 text-[#FF5C5C]" />
                    <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#444]">
                      Revenue Opportunity
                    </div>
                    <div className="relative">
                      <Info
                        className="w-[15px] h-[15px] text-[#A7A7A7] cursor-help"
                        onMouseEnter={() => setActiveTooltip("revenue")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "revenue" && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] w-[240px] bg-white rounded-lg shadow-lg p-3 text-[12px] text-[#333] leading-relaxed animate-in fade-in duration-300">
                          Estimates recoverable revenue from lost visibility or disapproved products.
                          <div className="mt-2 text-[11px] text-[#666]">
                            Formula: (Potential Impressions × Conversion Rate × Avg Order Value).
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KPI value - 4px gap from title */}
                  <div className="space-y-0.5">
                    <div className="text-[26px] font-semibold text-[#1B1B1B] leading-[1.1]">£19.4k</div>
                    {/* 2px gap to label */}
                    <div className="text-[12px] text-[#6A6A6A]">Missed Revenue</div>
                    {/* Subtext */}
                    <div className="text-[11px] text-[#7C7C7C]">From 1,603 rejected products</div>
                  </div>
                </div>

                {/* Buttons - aligned to bottom */}
                <div className="flex gap-1.5 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#FF5C5C] text-[#FF5C5C] bg-transparent hover:bg-[#FFECEC] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Opportunities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#FF5C5C] text-[#FF5C5C] bg-transparent hover:bg-[#FFECEC] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Fix Issues
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cross-Channel Stability Card */}
            <Card className="relative rounded-xl border border-[#E7E7E9] shadow-[0_2px_4px_rgba(0,0,0,0.03)] bg-[#F5F3FF] min-h-[230px] flex flex-col">
              {/* Thin top accent bar - 6px */}
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#8B5CF6]" />

              <CardContent className="py-[14px] px-[18px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-h-[44px]">
                    <Activity className="w-5 h-5 text-[#8B5CF6]" />
                    <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#444]">
                      Cross-Channel Stability
                    </div>
                    <div className="relative ml-auto">
                      <button
                        className="text-[#9A9A9A] hover:text-[#444] transition-colors"
                        onMouseEnter={() => setActiveTooltip("stability")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {activeTooltip === "stability" && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] w-[240px] bg-white rounded-lg shadow-lg p-3 text-[12px] text-[#333] leading-relaxed animate-in fade-in duration-300">
                          Measures consistency of performance across all active channels. Higher scores indicate
                          balanced, stable performance with low variance.
                          <div className="mt-2 text-[11px] text-[#666]">
                            Formula: 1 - (Standard Deviation of Channel Performance ÷ Mean Performance).
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[32px] font-bold text-[#444] leading-none">0.82</div>
                    <div className="text-[12px] font-medium text-[#666]">Stability Score</div>
                    <div className="text-[11px] text-[#9A9A9A] mt-1">Low variance across 6 channels</div>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#8B5CF6] text-[#8B5CF6] bg-transparent hover:bg-[#EDE9FE] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    View Balance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border border-[#8B5CF6] text-[#8B5CF6] bg-transparent hover:bg-[#EDE9FE] text-[11px] h-auto py-1.5 px-2.5"
                  >
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-8">
            {/* Divider line */}
            <div className="border-t border-[#E7E7E9] mb-6" />

            {/* AI Signal Layer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#444]">AI Signal Layer</h3>
                <div className="flex items-center gap-2">
                  {showAIInsights && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllSignals(!showAllSignals)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showAllSignals ? "View Less" : `View More (${insightConfigs.length - 5})`}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${showAllSignals ? "rotate-180" : ""}`}
                      />
                    </Button>
                  )}
                  <span className="text-sm text-[#666]">AI Insights</span>
                  <Switch checked={showAIInsights} onCheckedChange={setShowAIInsights} />
                </div>
              </div>

              {showAIInsights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {displayedSignals.map((config, index) => (
                    <div
                      key={index}
                      className={`bg-[#f9fafb] border ${config.borderColor} rounded-lg p-3 flex items-start gap-2 transition-all ${
                        config.channel ? "cursor-pointer hover:shadow-md hover:scale-105" : ""
                      } ${
                        selectedInsightConfig?.channel === config.channel && config.channel
                          ? "ring-2 ring-blue-500 shadow-lg"
                          : ""
                      }`}
                      onClick={() => {
                        if (config.onClickAction) {
                          config.onClickAction()
                        }
                        if (config.channel && config.metrics) {
                          setInsightTrigger({
                            channel: config.channel,
                            metrics: config.metrics,
                          })
                        }
                      }}
                    >
                      <Zap className="w-4 h-4 text-[#F6A800] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-[#444] leading-relaxed">{config.text}</p>
                        {config.channel && <p className="text-[10px] text-blue-500 mt-1">Click to view metrics →</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Trends Graph */}
            <div className="mt-8" data-graph-container>
              {/* Wrapped ProductTrendGraph in a Card and added collapse functionality */}
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setIsPerformanceTrendsCollapsed(!isPerformanceTrendsCollapsed)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>Performance Analysis</CardTitle>
                        <CardDescription>
                          Phase 2 — Analyse performance trends, correlate anomalies, and isolate potential causes.
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      {isPerformanceTrendsCollapsed ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span className="text-blue-600 font-medium">Expand</span>
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span className="text-blue-600 font-medium">Collapse</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!isPerformanceTrendsCollapsed && (
                  <CardContent>
                    <ProductTrendGraph
                      products={filteredProducts}
                      dateRange={dashboardDateRange}
                      insightConfig={insightTrigger} // Pass the trigger state
                      onInsightAction={handleAIInsightAction}
                      visibilityIndexMode={visibilityIndexClicked}
                    />
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Collapsible Create Product Segment Section */}
            <div className="mt-8" data-segment-builder>
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setIsSegmentBuilderCollapsed(!isSegmentBuilderCollapsed)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>Create Product Segment</CardTitle>
                        <CardDescription>
                          Build targeted product segments using advanced filters or AI-powered assistance
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      {isSegmentBuilderCollapsed ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span className="text-blue-600 font-medium">Expand</span>
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span className="text-blue-600 font-medium">Collapse</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!isSegmentBuilderCollapsed && (
                  <CardContent>
                    <SegmentBuilder
                      products={products}
                      onSegmentSaved={handleSegmentSaved}
                      initialSegment={activeSegment}
                      onLoadProducts={(segment) => {
                        setActiveSegment(segment)
                        const filtered = applySegmentFilters(products, segment.filters)
                        setSegmentProducts(filtered)
                        setFilteredProducts(filtered)
                        setShowAiResults(false)
                        setAiResults([])
                        setFeedHealthDrillDown(null)
                      }}
                    />

                    {/* Clear Filters Button - positioned next to Save Segment */}
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveSegment(null)
                          setSegmentProducts([])
                          setFilteredProducts(products)
                          setSelectedStatus("all")
                          setSelectedVisibility("all")
                          setSelectedBrand("all")
                          setShowAiResults(false)
                          setAiResults([])
                        }}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Product Table */}
            {/* Wrapped Product Viewer in a Card and added collapse functionality */}
            <Card>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setIsProductViewerCollapsed(!isProductViewerCollapsed)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>Product Insights</CardTitle>
                      <CardDescription>
                        Phase 3 — Inspect affected products and surface attribute-level issues impacting performance. •{" "}
                        {filteredProducts.length} products • {selectedProducts.length} selected
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    {isProductViewerCollapsed ? (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        <span className="text-blue-600 font-medium">Expand</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        <span className="text-blue-600 font-medium">Collapse</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!isProductViewerCollapsed && (
                <CardContent>
                  {/* Action Buttons */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Columns className="h-4 w-4 mr-2" />
                            Columns
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80">
                          <div className="p-2">
                            <Input
                              placeholder="Search columns..."
                              value={columnSearchTerm}
                              onChange={(e) => setColumnSearchTerm(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          <DropdownMenuSeparator />
                          <div className="max-h-96 overflow-y-auto">
                            {Object.entries(groupedFilteredColumns).map(([category, columns]) => (
                              <div key={category}>
                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 px-2 py-1">
                                  {category}
                                </DropdownMenuLabel>
                                {columns.map((column) => (
                                  <DropdownMenuCheckboxItem
                                    key={column.key}
                                    checked={visibleColumns.includes(column.key)}
                                    onCheckedChange={() => handleColumnToggle(column.key)}
                                  >
                                    {column.label}
                                  </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                              </div>
                            ))}
                          </div>
                          <div className="p-2 space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                              onClick={() => {
                                setVisibleColumns(availableColumns.map((col) => col.key))
                                setColumnSearchTerm("")
                              }}
                            >
                              Select All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                              onClick={() => {
                                setVisibleColumns(availableColumns.filter((col) => col.default).map((col) => col.key))
                                setColumnSearchTerm("")
                              }}
                            >
                              Reset to Default
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUseAlternateProducts(!useAlternateProducts)
                          setSelectedProducts([])
                        }}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {useAlternateProducts ? "Show Original Products" : "Toggle Products"}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Create CSV export of filtered products
                          const headers = visibleColumns
                            .map((col) => availableColumns.find((c) => c.key === col)?.label || col)
                            .join(",")
                          const rows = filteredProducts
                            .map((product) =>
                              visibleColumns
                                .map((col) => {
                                  switch (col) {
                                    case "productId":
                                      return `"${product.id}"`
                                    case "product":
                                      return `"${product.name}"`
                                    case "thumbnail":
                                      return `"${product.imageUrl}"`
                                    case "channelStatus":
                                      return `"${product.channelStatus}"`
                                    case "aiDiagnostic":
                                      return `"${product.aiDiagnostic}"`
                                    case "aiDetections": // Handle AI Detections
                                      return `"${product.aiDetections ? product.aiDetections.join("; ") : ""}"`
                                    case "imageQuality":
                                      return product.imageQuality || ""
                                    case "impressionChange":
                                      return product.impressionChange !== undefined
                                        ? `${product.impressionChange.toFixed(1)}%`
                                        : ""
                                    case "visibility":
                                      return product.visibilityScore
                                    case "clickChange":
                                      return product.clickChange !== undefined
                                        ? `${product.clickChange.toFixed(1)}%`
                                        : ""
                                    case "ctr":
                                      return product.ctr > 0 ? `${product.ctr.toFixed(2)}%` : ""
                                    case "revenueChange":
                                      return product.revenueChange !== undefined
                                        ? `${product.revenueChange.toFixed(1)}%`
                                        : ""
                                    case "gmcIssueType":
                                      return `"${product.gmcIssueType}"`
                                    case "issueTimestamp":
                                      return `"${product.issueTimestamp}"`
                                    case "resolutionStatus":
                                      return `"${product.resolutionStatus}"`
                                    case "actions": // New column for Actions
                                      return `"View Details"`
                                    case "brand":
                                      return `"${product.brand}"`
                                    case "category":
                                      return `"${product.category}"`
                                    case "price":
                                      return product.price
                                    case "color":
                                      return `"${product.color}"`
                                    case "size":
                                      return `"${product.size}"`
                                    case "stock":
                                      return product.inventoryLevel
                                    case "status":
                                      return product.approvalStatus
                                    case "issues":
                                      return `"${product.issues.join("; ")}"`
                                    case "impressions":
                                      return product.impressions
                                    case "cpc":
                                      return product.cpc > 0 ? product.cpc.toFixed(2) : ""
                                    case "roi":
                                      return product.roas > 0 ? ((product.roas - 1) * 100).toFixed(1) : ""
                                    case "returnRate":
                                      return product.returnRate > 0 ? product.returnRate.toFixed(1) : ""
                                    case "searchTerms":
                                      return `"${product.topSearchTerms.join(", ")}"`
                                    case "causeDetected":
                                      return `"${product.causeDetected}"`
                                    case "changePeriod":
                                      return `"${product.changePeriod}"`
                                    default:
                                      return ""
                                  }
                                })
                                .join(","),
                            )
                            .join("\n")

                          const csv = headers + "\n" + rows
                          const blob = new Blob([csv], { type: "text/csv" })
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `product-viewer-${new Date().toISOString().split("T")[0]}.csv`
                          a.click()
                          window.URL.revokeObjectURL(url)
                        }}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Export CSV ({filteredProducts.length})
                      </Button>
                      <Button
                        onClick={proceedToOptimize}
                        disabled={selectedProducts.length === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Optimize Selected ({selectedProducts.length})
                      </Button>
                    </div>
                  </div>

                  {/* Pivot Controls */}
                  <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={viewMode === "product" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("product")}
                      >
                        Product View
                      </Button>
                      <Button
                        variant={viewMode === "pivot" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("pivot")}
                      >
                        Pivot View
                      </Button>

                      {viewMode === "pivot" && (
                        <>
                          <div className="text-sm text-muted-foreground">Group by:</div>
                          {[1, 2, 3].map((level) => (
                            <DropdownMenu key={level}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Level {level}:{" "}
                                  {pivotDimensions[level - 1]
                                    ? pivotableFields.find((f) => f.key === pivotDimensions[level - 1])?.label
                                    : "Select"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Group Level {level}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                  checked={!pivotDimensions[level - 1]}
                                  onCheckedChange={() => {
                                    const newDimensions = [...pivotDimensions]
                                    newDimensions[level - 1] = ""
                                    setPivotDimensions(newDimensions.filter((d) => d !== ""))
                                  }}
                                >
                                  None
                                </DropdownMenuCheckboxItem>
                                {pivotableFields.map((field) => (
                                  <DropdownMenuCheckboxItem
                                    key={field.key}
                                    checked={pivotDimensions[level - 1] === field.key}
                                    onCheckedChange={() => {
                                      const newDimensions = [...pivotDimensions]
                                      newDimensions[level - 1] = field.key
                                      setPivotDimensions(newDimensions.filter((d) => d !== ""))
                                    }}
                                  >
                                    {field.label}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Product/Pivot Table */}
                  {viewMode === "product" ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-3 font-medium text-sm">
                              <input
                                type="checkbox"
                                checked={
                                  selectedProducts.length === filteredProducts.length && filteredProducts.length > 0
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="rounded"
                              />
                            </th>
                            {visibleColumns.includes("productId") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Product ID</th>
                            )}
                            {visibleColumns.includes("product") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Product Title</th>
                            )}
                            {visibleColumns.includes("thumbnail") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Thumbnail</th>
                            )}
                            {visibleColumns.includes("channelStatus") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Channel Status</th>
                            )}
                            {visibleColumns.includes("aiDiagnostic") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">AI Diagnostic</th>
                            )}
                            {visibleColumns.includes("aiDetections") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">AI Detections</th>
                            )}
                            {visibleColumns.includes("imageQuality") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Image Quality</th>
                            )}
                            {visibleColumns.includes("impressionChange") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Impression Change %</th>
                            )}
                            {visibleColumns.includes("visibility") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Visibility</th>
                            )}
                            {visibleColumns.includes("clickChange") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Click Change %</th>
                            )}
                            {visibleColumns.includes("ctr") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">CTR</th>
                            )}
                            {visibleColumns.includes("revenueChange") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Revenue Change %</th>
                            )}
                            {visibleColumns.includes("gmcIssueType") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">GMC Issue Type</th>
                            )}
                            {visibleColumns.includes("issueTimestamp") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Issue Timestamp</th>
                            )}
                            {visibleColumns.includes("resolutionStatus") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Resolution Status</th>
                            )}
                            {visibleColumns.includes("actions") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Actions</th>
                            )}
                            {visibleColumns.includes("brand") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Brand</th>
                            )}
                            {visibleColumns.includes("category") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Category</th>
                            )}
                            {visibleColumns.includes("price") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Price</th>
                            )}
                            {visibleColumns.includes("color") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Color</th>
                            )}
                            {visibleColumns.includes("size") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Size</th>
                            )}
                            {visibleColumns.includes("stock") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Stock</th>
                            )}
                            {visibleColumns.includes("status") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Status</th>
                            )}
                            {visibleColumns.includes("issues") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Issues</th>
                            )}
                            {visibleColumns.includes("impressions") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Impressions</th>
                            )}
                            {visibleColumns.includes("cpc") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">CPC</th>
                            )}
                            {visibleColumns.includes("roi") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">ROI</th>
                            )}
                            {visibleColumns.includes("returnRate") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Return Rate</th>
                            )}
                            {visibleColumns.includes("searchTerms") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Search Terms</th>
                            )}
                            {visibleColumns.includes("causeDetected") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Cause Detected</th>
                            )}
                            {visibleColumns.includes("changePeriod") && (
                              <th className="text-left py-2 px-3 font-medium text-sm">Change Period</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-gray-100 hover:bg-gray-50 group relative"
                              title={`Product ID: ${product.id}\nTitle: ${product.name}\nImpression Change: ${
                                product.impressionChange?.toFixed(1) ?? "N/A"
                              }%\nVisibility: ${product.visibilityScore}\nGMC Issue: ${product.gmcIssueType || "N/A"}`}
                            >
                              <td className="py-2 px-3">
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.some((p) => p.id === product.id)}
                                  onChange={(e) => handleProductSelect(product, e.target.checked)}
                                  className="rounded"
                                />
                              </td>
                              {visibleColumns.includes("productId") && (
                                <td className="py-2 px-3 text-sm text-gray-600">{product.id}</td>
                              )}
                              {visibleColumns.includes("product") && (
                                <td className="py-2 px-3">
                                  <div className="font-medium text-sm truncate max-w-[250px]" title={product.name}>
                                    {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes("thumbnail") && (
                                <td className="py-2 px-3">
                                  <img
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name}
                                    className={`w-12 h-12 rounded object-cover bg-gray-200 ${
                                      product.imageQuality === "low" ||
                                      product.imageQuality === "blurry" ||
                                      product.imageQuality === "poor"
                                        ? "blur-sm opacity-70"
                                        : ""
                                    }`}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = "none"
                                      const parent = target.parentElement
                                      if (parent) {
                                        const fallback = document.createElement("div")
                                        fallback.className =
                                          "w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600"
                                        fallback.textContent = product.brand.charAt(0)
                                        parent.insertBefore(fallback, target)
                                      }
                                    }}
                                  />
                                </td>
                              )}
                              {visibleColumns.includes("channelStatus") && (
                                <td className="py-2 px-3">
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 w-fit">
                                    <span>⚠</span>
                                    <span>{product.channelStatus || "Warning"}</span>
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("aiDiagnostic") && (
                                <td className="py-2 px-3 text-sm text-gray-700">
                                  {product.aiDiagnostic || "Feed issue: image quality"}
                                </td>
                              )}
                              {visibleColumns.includes("aiDetections") && (
                                <td className="py-2 px-3">
                                  {product.aiDetections && product.aiDetections.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {product.aiDetections.slice(0, 2).map((detection, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {detection}
                                        </Badge>
                                      ))}
                                      {product.aiDetections.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{product.aiDetections.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                      None
                                    </Badge>
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("imageQuality") && (
                                <td className="py-2 px-3">
                                  <Badge
                                    className={
                                      product.imageQuality === "poor" ||
                                      product.imageQuality === "low" ||
                                      product.imageQuality === "blurry"
                                        ? "bg-red-100 text-red-800 border-red-200"
                                        : "bg-green-100 text-green-800 border-green-200"
                                    }
                                  >
                                    {product.imageQuality === "poor" ||
                                    product.imageQuality === "low" ||
                                    product.imageQuality === "blurry"
                                      ? "Poor"
                                      : "Good"}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("impressionChange") && (
                                <td className="py-2 px-3 text-sm font-medium">
                                  {product.impressionChange !== undefined ? (
                                    <span className={product.impressionChange < 0 ? "text-red-600" : "text-green-600"}>
                                      {product.impressionChange.toFixed(1)}%
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("visibility") && (
                                <td className="py-2 px-3">
                                  <div className="flex items-center space-x-2">
                                    {getVisibilityBadge(product.visibilityScore)}
                                    <span className="text-xs text-gray-500">{product.visibilityScore}</span>
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes("clickChange") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.clickChange !== undefined ? (
                                    <span className={product.clickChange < 0 ? "text-red-600" : "text-green-600"}>
                                      {product.clickChange.toFixed(1)}%
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("ctr") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.ctr > 0 ? `${product.ctr.toFixed(2)}%` : "-"}
                                </td>
                              )}
                              {visibleColumns.includes("revenueChange") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.revenueChange !== undefined ? (
                                    <span className={product.revenueChange < 0 ? "text-red-600" : "text-green-600"}>
                                      {product.revenueChange.toFixed(1)}%
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("gmcIssueType") && (
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.gmcIssueType || "N/A"}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("issueTimestamp") && (
                                <td className="py-2 px-3 text-sm text-gray-600">
                                  {product.issueTimestamp ? new Date(product.issueTimestamp).toLocaleString() : "N/A"}
                                </td>
                              )}
                              {visibleColumns.includes("resolutionStatus") && (
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.resolutionStatus || "Unresolved"}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("actions") && (
                                <td className="py-2 px-3">
                                  <Button
                                    variant="link"
                                    className="p-0 h-auto text-blue-600 hover:underline"
                                    onClick={() => {
                                      // Placeholder for action: navigate to product details or trigger modal
                                      alert(`View details for product ${product.id}`)
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </td>
                              )}
                              {visibleColumns.includes("brand") && (
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.brand}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("category") && (
                                <td className="py-2 px-3">
                                  <div className="text-xs text-gray-600 max-w-32 truncate" title={product.category}>
                                    {product.category}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes("price") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.price > 0 ? (
                                    `$${product.price.toFixed(2)}`
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      Missing
                                    </Badge>
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("color") && (
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.color}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("size") && (
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.size}
                                  </Badge>
                                </td>
                              )}
                              {visibleColumns.includes("stock") && (
                                <td className="py-2 px-3">
                                  {getStockBadge(product.availability, product.inventoryLevel)}
                                </td>
                              )}
                              {visibleColumns.includes("status") && (
                                <td className="py-2 px-3">
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(product.approvalStatus)}
                                    <span className="text-xs capitalize">{product.approvalStatus}</span>
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes("issues") && (
                                <td className="py-2 px-3">
                                  {product.issues.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {product.issues.slice(0, 2).map((issue, index) => (
                                        <Badge key={index} variant="destructive" className="text-xs">
                                          {issue}
                                        </Badge>
                                      ))}
                                      {product.issues.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{product.issues.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                      No Issues
                                    </Badge>
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("impressions") && (
                                <td className="py-2 px-3 text-sm">{product.impressions.toLocaleString()}</td>
                              )}
                              {visibleColumns.includes("cpc") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.cpc > 0 ? `$${product.cpc.toFixed(2)}` : "-"}
                                </td>
                              )}
                              {visibleColumns.includes("roi") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.roas > 0 ? `${((product.roas - 1) * 100).toFixed(1)}%` : "-"}
                                </td>
                              )}
                              {visibleColumns.includes("returnRate") && (
                                <td className="py-2 px-3 text-sm">
                                  {product.returnRate > 0 ? `${product.returnRate.toFixed(1)}%` : "-"}
                                </td>
                              )}
                              {visibleColumns.includes("searchTerms") && (
                                <td className="py-2 px-3">
                                  <div className="text-xs text-gray-600 max-w-32">
                                    {product.topSearchTerms.length > 0
                                      ? product.topSearchTerms.slice(0, 3).join(", ")
                                      : "No data"}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes("causeDetected") && (
                                <td className="py-2 px-3 text-sm">{product.causeDetected || "-"}</td>
                              )}
                              {visibleColumns.includes("changePeriod") && (
                                <td className="py-2 px-3 text-sm">{product.changePeriod || "-"}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <PivotTable
                      products={filteredProducts}
                      dimensions={pivotDimensions}
                      expandedRows={expandedRows}
                      setExpandedRows={setExpandedRows}
                    />
                  )}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No products found matching your criteria.</p>
                      <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search-optimizer" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Term Optimizer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered search term analysis and optimization recommendations
              </p>
            </div>

            {/* Locked Feature Content */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-90 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center space-y-4">
                  <div
                    className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => setShowUpgradeDialog(true)}
                  >
                    <Lock className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">Premium Feature</h4>
                    <p className="text-sm text-gray-600 max-w-md">
                      Unlock advanced search term optimization with AI-powered insights and recommendations
                    </p>
                    <Button
                      onClick={() => setShowUpgradeDialog(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upgrade to Access
                    </Button>
                  </div>
                </div>
              </div>

              {/* Blurred Preview Content */}
              <CardContent className="p-8 filter blur-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Search Volume Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">2.4M</div>
                        <div className="text-xs text-muted-foreground">Monthly searches</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Keyword Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">147</div>
                        <div className="text-xs text-muted-foreground">New keywords found</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Optimization Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">73%</div>
                        <div className="text-xs text-muted-foreground">Current optimization</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Top Keyword Recommendations</h4>
                    <div className="space-y-2">
                      {["wireless bluetooth headphones", "noise cancelling earbuds", "premium audio accessories"].map(
                        (keyword, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{keyword}</div>
                              <div className="text-sm text-gray-500">
                                Search volume: {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}
                              </div>
                            </div>
                            <Badge variant="outline">High Impact</Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <span>Premium Feature</span>
            </DialogTitle>
            <DialogDescription>
              Contact your Customer Success Manager to upgrade your package and unlock advanced search optimization
              features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would open email client or contact form
                window.location.href = "mailto:csm@company.com?subject=Upgrade Request - Search Optimizer"
                setShowUpgradeDialog(false)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Contact CSM
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
