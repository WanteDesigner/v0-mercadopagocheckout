import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MERCADO_PAGO_ACCESS_TOKEN = "APP_USR-2720419685245259-111221-718e950f8f357595034feedcf7f407c3-2581667410"
const WEBHOOK_SECRET = "0fb03936598a0712cc25f0854db9939c281a86829d0c160e0f760d1eb2126df2"

function verifySignature(request: NextRequest, body: string): boolean {
  try {
    const xSignature = request.headers.get("x-signature")
    const xRequestId = request.headers.get("x-request-id")

    if (!xSignature || !xRequestId) {
      console.log("[v0] Missing signature headers")
      return false
    }

    const parts = xSignature.split(",")
    let ts: string | null = null
    let hash: string | null = null

    for (const part of parts) {
      const [key, value] = part.split("=")
      if (key && value) {
        const trimmedKey = key.trim()
        const trimmedValue = value.trim()
        if (trimmedKey === "ts") {
          ts = trimmedValue
        } else if (trimmedKey === "v1") {
          hash = trimmedValue
        }
      }
    }

    if (!ts || !hash) {
      console.log("[v0] Invalid signature format")
      return false
    }

    const manifest = `id:${xRequestId};request-id:${xRequestId};ts:${ts};`

    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET)
    hmac.update(manifest)
    const expectedSignature = hmac.digest("hex")

    console.log("[v0] Signature verification - Expected:", expectedSignature, "Received:", hash)

    return expectedSignature === hash
  } catch (error) {
    console.error("[v0] Error verifying signature:", error)
    return false
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Webhook endpoint is active",
    methods: ["POST"],
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Webhook POST recebido")
    console.log("[v0] Headers:", Object.fromEntries(request.headers.entries()))

    const rawBody = await request.text()
    console.log("[v0] Raw body:", rawBody)

    const body = JSON.parse(rawBody)
    console.log("[v0] Webhook do Mercado Pago recebido:", body)

    const isTestNotification = body.live_mode === false && body.id === "123456"

    if (!isTestNotification) {
      const isValid = verifySignature(request, rawBody)
      if (!isValid) {
        console.error("[v0] Assinatura do webhook inválida - rejeitando requisição")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
      console.log("[v0] Assinatura do webhook verificada com sucesso")
    } else {
      console.log("[v0] Test notification detected - skipping signature verification")
    }

    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id

      if (isTestNotification) {
        console.log("[v0] Test notification - not calling Mercado Pago API")
        return NextResponse.json({ received: true, test: true })
      }

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      })

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json()
        console.log("[v0] Status do pagamento:", payment.status)
        console.log("[v0] External reference:", payment.external_reference)

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
