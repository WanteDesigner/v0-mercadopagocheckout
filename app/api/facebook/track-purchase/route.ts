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
    } = body

    console.log(`[v0] Enviando evento ${event_name} para Facebook Pixel:`, {
      value,
      currency,
      products,
      payment_id,
    })

    const pixelId = "715632621530184"
    const accessToken =
      "EAAKMNWt9tWoBP7GryB1ZBmDwLSxm88JeIiKeybhtlZBctH5dc8cZC5vZBoZBk4ZAUB6Nhq6FZBX2fQlkqRhxJQZALWhCBkM9RqqJsCmpdZBl5jM15mrck6mt89sZASDfEsZBk79uyZABb4RYQyW0KlGveurkPX9JpPk3ZATeodohZCIMdS6r0NiU2bS3kromieRYSvqAZDZD"

    const clientIp =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "127.0.0.1"

    const userAgent = request.headers.get("user-agent") || ""

    const cookies = request.headers.get("cookie") || ""
    const fbcMatch = cookies.match(/_fbc=([^;]+)/)
    const fbc = fbcMatch ? fbcMatch[1] : undefined

    const fbpMatch = cookies.match(/_fbp=([^;]+)/)
    const fbp = fbpMatch ? fbpMatch[1] : undefined

    const userData: any = {}

    if (email) {
      userData.em = await hashData(email)
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

    const facebookResponse = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            event_name: event_name,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: request.headers.get("referer") || "https://checkoutmanga.vercel.app",
            user_data: userData,
            custom_data: {
              currency: currency || "BRL",
              value: value,
              content_ids: contentIds,
              content_type: "product",
              num_items: contentIds.length,
              order_id: payment_id,
              predicted_ltv: event_name === "Purchase" ? value * 1.5 : undefined,
            },
          },
        ],
        access_token: accessToken,
      }),
    })

    const facebookResult = await facebookResponse.json()
    console.log(`[v0] Facebook Conversions API ${event_name} response:`, facebookResult)

    const pixelScript = `
      if (typeof fbq !== 'undefined') {
        fbq('track', '${event_name}', {
          value: ${value},
          currency: '${currency || "BRL"}',
          content_ids: ${JSON.stringify(contentIds)},
          content_type: 'product',
          num_items: ${contentIds.length},
          ${event_name === "Purchase" ? `order_id: '${payment_id}',` : ""}
          ${event_name === "Purchase" ? `predicted_ltv: ${value * 1.5}` : ""}
        });
        console.log('[v0] Facebook Pixel ${event_name} event sent:', {
          value: ${value},
          currency: '${currency || "BRL"}',
          content_ids: ${JSON.stringify(contentIds)},
          ${event_name === "Purchase" ? `order_id: '${payment_id}'` : ""}
        });
      } else {
        console.log('[v0] Facebook Pixel not loaded');
      }
    `

    return NextResponse.json({
      success: true,
      script: pixelScript,
      facebook_api: facebookResult,
      message: `Evento ${event_name} Facebook Pixel enviado com content_ids corrigidos`,
      content_ids: contentIds,
      match_quality_data: {
        has_email: !!email,
        has_phone: !!phone,
        has_name: !!(first_name || last_name),
        has_address: !!(city || state || zip_code),
        has_fbc: !!fbc,
        has_fbp: !!fbp,
        has_ip: !!clientIp,
        has_user_agent: !!userAgent,
      },
    })
  } catch (error) {
    console.error(`Erro ao processar evento Facebook Pixel:`, error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
