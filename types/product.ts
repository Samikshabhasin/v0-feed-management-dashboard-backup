export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  currency: string
  availability: string
  condition: string
  visibilityScore: number
  clicks: number
  impressions: number
  ctr: number
  cpc: number
  conversions: number
  revenue: number
  roas: number
  conversionRate: number
  returnRate: number
  bounceRate: number
  approvalStatus: string
  lastUpdated: string
  imageUrl?: string
  description: string
  gtin: string
  mpn: string
  inventoryLevel: number
  shippingCost: number
  color: string
  size: string
  material: string
  targetCountry: string
  feedSource: string
  customLabels: string[]
  issues: string[]
  opportunities: string[]

  // Search Intelligence (Algolia) fields
  searchImpressions: number
  searchClicks: number
  searchCtr: number
  searchAddToCarts: number
  searchPurchases: number
  searchConversionRate: number
  topSearchTerms: string[]

  // AI Commerce Metrics (OpenAI API fields)
  enable_search: string // "yes" or "no" - Indicates if product is discoverable through AI-powered product discovery (e.g., ChatGPT Shopping)
  enable_checkout: string // "yes" or "no" - Indicates if product supports AI-driven checkout flows (e.g., ChatGPT integrated cart)

  imageQuality?: "high" | "low" | "blurry" | "poor" // Image quality assessment

  // AI diagnostic fields for segment filtering
  impressionChange?: number // Percentage change in impressions
  clickChange?: number // Percentage change in clicks
  causeDetected?: string // AI-detected root cause
  changePeriod?: string // Time period for the change analysis

  channelStatus?: string // Channel status (e.g., "Warning", "Active", "Paused")
  aiDiagnostic?: string // AI diagnostic message
  aiDetections?: string[] // Added AI Detections field - array of detected issues
  gmcIssueType?: string // Google Merchant Center issue type
  issueTimestamp?: string // Timestamp when issue was detected
  resolutionStatus?: string // Resolution status (e.g., "Unresolved", "Resolved", "In Progress")
  revenueChange?: number // Percentage change in revenue
  productId?: string // Product ID for table display
}
