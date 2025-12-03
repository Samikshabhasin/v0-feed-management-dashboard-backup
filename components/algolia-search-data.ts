import type { Product } from "@/types/product"

// Function to add realistic Algolia Search Intelligence data to products
export function addAlgoliaSearchData(products: Product[]): Product[] {
  return products.map((product) => {
    // If product already has search data, return as is
    if (product.searchImpressions && product.searchImpressions > 0) {
      return product
    }

    // Generate realistic search data based on product characteristics
    const baseSearchVolume = getBaseSearchVolume(product)
    const searchMultiplier = getSearchMultiplier(product)

    const searchImpressions = Math.round(baseSearchVolume * searchMultiplier)
    const searchCtr = 3.5 + Math.random() * 4 // 3.5% to 7.5%
    const searchClicks = Math.round(searchImpressions * (searchCtr / 100))
    const searchConversionRate = 1.5 + Math.random() * 3 // 1.5% to 4.5%
    const searchPurchases = Math.round(searchClicks * (searchConversionRate / 100))
    const searchAddToCarts = Math.round(searchPurchases * (2 + Math.random() * 2)) // 2x to 4x purchases

    return {
      ...product,
      searchImpressions,
      searchClicks,
      searchCtr: Number(searchCtr.toFixed(2)),
      searchAddToCarts,
      searchPurchases,
      searchConversionRate: Number(searchConversionRate.toFixed(2)),
      topSearchTerms: generateSearchTerms(product),
    }
  })
}

function getBaseSearchVolume(product: Product): number {
  // Base search volume based on category
  const categoryVolumes: Record<string, number> = {
    Electronics: 50000,
    Footwear: 35000,
    Apparel: 25000,
    Accessories: 15000,
    Home: 20000,
    Sports: 18000,
  }

  const category = product.category.split(" > ")[0]
  return categoryVolumes[category] || 20000
}

function getSearchMultiplier(product: Product): number {
  let multiplier = 1

  // Brand popularity affects search volume
  const popularBrands = ["Nike", "Apple", "Samsung", "Sony", "Adidas"]
  if (popularBrands.includes(product.brand)) {
    multiplier *= 1.5
  }

  // Price range affects search volume
  if (product.price > 500) {
    multiplier *= 0.7 // Expensive items have lower search volume
  } else if (product.price < 100) {
    multiplier *= 1.3 // Cheaper items have higher search volume
  }

  // Approval status affects search visibility
  if (product.approvalStatus === "disapproved") {
    multiplier *= 0.1
  } else if (product.approvalStatus === "pending") {
    multiplier *= 0.3
  }

  // Add some randomness
  multiplier *= 0.7 + Math.random() * 0.6 // 70% to 130%

  return multiplier
}

function generateSearchTerms(product: Product): string[] {
  const terms: string[] = []

  // Add brand-based terms
  terms.push(product.brand.toLowerCase())

  // Add product type terms based on category
  const category = product.category.toLowerCase()
  if (category.includes("shoes") || category.includes("footwear")) {
    terms.push("shoes", "sneakers", "footwear")
  } else if (category.includes("phone") || category.includes("mobile")) {
    terms.push("phone", "smartphone", "mobile")
  } else if (category.includes("headphones") || category.includes("audio")) {
    terms.push("headphones", "earphones", "audio")
  } else if (category.includes("clothing") || category.includes("apparel")) {
    terms.push("clothing", "apparel", "fashion")
  }

  // Add color-based terms
  if (product.color) {
    terms.push(product.color.toLowerCase())
  }

  // Add specific product terms based on name
  const name = product.name.toLowerCase()
  if (name.includes("running")) terms.push("running")
  if (name.includes("gaming")) terms.push("gaming")
  if (name.includes("wireless")) terms.push("wireless")
  if (name.includes("pro")) terms.push("pro", "professional")
  if (name.includes("max")) terms.push("max")
  if (name.includes("ultra")) terms.push("ultra")

  // Return unique terms, limited to top 4
  return [...new Set(terms)].slice(0, 4)
}
