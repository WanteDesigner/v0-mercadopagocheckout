import { type NextRequest, NextResponse } from "next/server"
import { crypto } from "webcrypto"

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      value,
      currency,
      products,
      payment_id,
      phone,
      first_name,
      last_name,
      city,
      state,
      country,
      zip_code,
      event_name = "Purchase",
      event_id,
    } = body

    console.log(`[v0] === INÍCIO DO PROCESSAMENTO DO EVENTO ${event_name} ===`)
    console.log(`[v0] Event ID recebido:`, event_id)
    console.log(`[v0] Dados recebidos:`, { email, value, currency, products, payment_id })

    const pixelId = "715632621530184"
    const accessToken =
      "EAAKMNWt9tWoBPzDw7j4teZAde54JFzSY4NRP6pB3m7q2GfaGtR50RyBRbf0frYGn1S7a519R54hq6Azkko3hZBgJiNDeSC0ZBXHnZA9AmnFEpyOw7A70nNv2SzPjTYWMDTNTGjNYf2UHMgrdv8eTZA53eiLUuUHorUNpF6DoABaq2tG4pPVx7m7UxG8tQWwZDZD"

    const clientIp =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "127.0.0.1"

    const userAgent = request.headers.get("user-agent") || ""

    const cookies = request.headers.get("cookie") || ""
    const fbcMatch = cookies.match(/_fbc=([^;]+)/)
    const fbc = fbcMatch ? fbcMatch[1] : undefined

    const fbpMatch = cookies.match(/_fbp=([^;]+)/)
    const fbp = fbpMatch ? fbpMatch[1] : undefined

    const userData: any = {}

    try {
      if (email) {
        userData.em = await hashData(email)
        console.log("[v0] Email hasheado com sucesso")
      }

      if (phone) {
        const cleanPhone = phone.replace(/\D/g, "")
        const phoneWithCountry = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`
        userData.ph = await hashData(phoneWithCountry)
      }

      if (first_name) {
        userData.fn = await hashData(first_name)
      }

      if (last_name) {
        userData.ln = await hashData(last_name)
      }

      if (city) {
        userData.ct = await hashData(city)
      }

      if (state) {
        userData.st = await hashData(state)
      }

      if (country) {
        userData.country = await hashData(country)
      }

      if (zip_code) {
        userData.zp = await hashData(zip_code)
      }
    } catch (hashError) {
      console.error("[v0] Erro ao hashear dados do usuário:", hashError)
      // Continue even if hashing fails
    }

    userData.client_ip_address = clientIp
    userData.client_user_agent = userAgent

    if (fbc) {
      userData.fbc = fbc
    }

    if (fbp) {
      userData.fbp = fbp
    }

    const contentIds = Array.isArray(products)
      ? products.filter((p) => p && typeof p === "string").map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "_"))
      : [payment_id || "unknown_product"]

    console.log("[v0] Content IDs gerados:", contentIds)
    console.log("[v0] User data preparado:", Object.keys(userData))

    if (!event_id) {
      console.error("[v0] ERRO: event_id não fornecido no body da requisição!")
      return NextResponse.json(
        {
          error: "event_id é obrigatório para desduplicação",
          details: "O parâmetro event_id deve ser enviado no body da requisição",
        },
        { status: 400 },
      )
    }

    const eventPayload = {
      data: [
        {
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id, // Use the event_id directly, no fallback
          action_source: "website",
          event_source_url: request.headers.get("referer") || "https://checkoutmanga.vercel.app",
          user_data: userData,
          custom_data: {
            currency: currency || "BRL",
            value: Number(value) || 0,
            content_ids: contentIds,
            content_type: "product",
            num_items: contentIds.length,
            order_id: payment_id,
            predicted_ltv: event_name === "Purchase" ? Number(value) * 1.5 : undefined,
          },
        },
      ],
      access_token: accessToken,
    }

    console.log("[v0] Enviando payload para Facebook com event_id:", event_id) // Confirm event_id in payload

    const facebookResponse = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    })

    const facebookResult = await facebookResponse.json()

    if (!facebookResponse.ok || facebookResult.error) {
      console.error("[v0] Erro na resposta do Facebook:", facebookResult)
      throw new Error(`Facebook API Error: ${JSON.stringify(facebookResult)}`)
    }

    console.log(`[v0] Facebook Conversions API ${event_name} response:`, facebookResult)
    console.log(`[v0] === FIM DO PROCESSAMENTO DO EVENTO ${event_name} ===`)

    return NextResponse.json({
      success: true,
      facebook_api: facebookResult,
      message: `Evento ${event_name} enviado com sucesso`,
      event_id: event_id,
      content_ids: contentIds,
    })
  } catch (error) {
    console.error(`[v0] ERRO CRÍTICO ao processar evento Facebook Pixel:`, error)
    console.error(`[v0] Stack trace:`, error instanceof Error ? error.stack : "Sem stack trace")
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
