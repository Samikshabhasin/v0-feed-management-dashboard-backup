import { NextResponse } from "next/server"
import runDiagnoseQuery from "@/lib/queries/diagnose"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const rows = await runDiagnoseQuery()

    const normalised = rows.map((r) => ({
      date: r.date?.value ?? r.date,
      variantId: r.variant_id,
      impressions: r.impressions,
      clicks: r.clicks,
      cost: r.cost,
      conversions: r.conversions,
      revenue: r.revenue,
      source: r.source,
    }))

    return NextResponse.json(normalised)
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to run diagnose query",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
