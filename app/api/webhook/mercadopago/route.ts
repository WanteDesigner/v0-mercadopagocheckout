import { type NextRequest, NextResponse } from "next/server"

const MERCADO_PAGO_ACCESS_TOKEN = "APP_USR-2720419685245259-111221-718e950f8f357595034feedcf7f407c3-2581667410"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Webhook do Mercado Pago recebido:", body)

    // Check if it's a payment notification
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id

      // Fetch payment details
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      })

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json()
        console.log("[v0] Status do pagamento:", payment.status)
        console.log("[v0] External reference:", payment.external_reference)

        // If payment is approved, send Purchase event to Facebook
        if (payment.status === "approved") {
          console.log("[v0] Pagamento aprovado! Enviando evento Purchase...")

          const eventId = `purchase_${paymentId}_${Date.now()}`

          try {
            await fetch(`${request.nextUrl.origin}/api/facebook/track-purchase`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                event_name: "Purchase",
                event_id: eventId,
                value: payment.transaction_amount,
                currency: "BRL",
                products: [payment.description],
                email: payment.payer.email,
                payment_id: paymentId.toString(),
              }),
            })
            console.log("[v0] Purchase event sent via webhook")
          } catch (error) {
            console.error("[v0] Erro ao enviar Purchase event via webhook:", error)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 })
  }
}
