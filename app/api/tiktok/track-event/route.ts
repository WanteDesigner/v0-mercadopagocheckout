import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_name, event_id, value, currency, products, email, phone, payment_id } = body

    const pixelId = "D4B27KBC77UF4SPAH9HG"
    const accessToken = "16f9f889b391f5ef161385a7d93612c7dacd8c02"

    console.log("[v0] TikTok API - Enviando evento:", event_name, "com event_id:", event_id)

    // Build event data for TikTok Events API
    const eventData = {
      pixel_code: pixelId,
      event: event_name,
      event_id: event_id,
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
      context: {
        user_agent: request.headers.get("user-agent") || "",
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "",
      },
      properties: {
        currency: currency || "BRL",
        value: value || 0,
        contents:
          products?.map((product: string) => ({
            content_name: product,
          })) || [],
      },
    }

    // Add user data if available
    if (email) {
      eventData.context = {
        ...eventData.context,
        user: {
          email: email,
          phone_number: phone || "",
        },
      }
    }

    console.log("[v0] TikTok Event Data:", JSON.stringify(eventData, null, 2))

    const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: pixelId,
        data: [eventData],
      }),
    })

    const responseText = await response.text()
    console.log("[v0] TikTok API Response:", response.status, responseText)

    if (!response.ok) {
      console.error("[v0] TikTok API Error:", response.status, responseText)
      return NextResponse.json(
        { error: "Failed to send TikTok event", details: responseText },
        { status: response.status },
      )
    }

    const data = JSON.parse(responseText)
    console.log("[v0] TikTok event sent successfully:", data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in TikTok API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
