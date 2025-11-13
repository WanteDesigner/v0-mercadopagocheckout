import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get("payment_id")

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    console.log("[v0] Checking payment status for ID:", paymentId)

    const accessToken = "APP_USR-2720419685245259-111221-718e950f8f357595034feedcf7f407c3-2581667410"

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Mercado Pago API error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to check payment status" }, { status: response.status })
    }

    const paymentData = await response.json()

    console.log("[v0] Payment status from Mercado Pago:", paymentData.status)
    console.log("[v0] Payment status detail:", paymentData.status_detail)

    return NextResponse.json({
      payment_id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      transaction_amount: paymentData.transaction_amount,
      date_approved: paymentData.date_approved,
    })
  } catch (error) {
    console.error("[v0] Error checking payment status:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
