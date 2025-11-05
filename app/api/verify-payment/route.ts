import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, paymentId, products, totalValue } = body

    console.log("[v0] Verificando pagamento:", { email, paymentId, products, totalValue })

    if (!email || !paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Email e paymentId são obrigatórios",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Enviando evento Purchase para Facebook Pixel")

    const baseUrl =
      request.headers.get("origin") ||
      request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "https://checkoutmanga.vercel.app"
    const facebookApiUrl = `${baseUrl}/api/facebook/track-purchase`

    console.log("[v0] Facebook API URL:", facebookApiUrl)

    const facebookResponse = await fetch(facebookApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
        "user-agent": request.headers.get("user-agent") || "",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
      },
      body: JSON.stringify({
        email,
        value: totalValue || 10.0,
        currency: "BRL",
        products: products || ["charlie_brown"],
        payment_id: paymentId,
        event_name: "Purchase",
      }),
    })

    if (!facebookResponse.ok) {
      const errorText = await facebookResponse.text()
      console.error("[v0] Facebook API error response:", errorText)
      throw new Error(`Facebook API returned ${facebookResponse.status}: ${errorText}`)
    }

    const facebookResult = await facebookResponse.json()
    console.log("[v0] Facebook Purchase event result:", facebookResult)

    const redirectLink = "https://nostalflix.vercel.app"

    console.log("[v0] Pagamento verificado, Purchase event enviado, redirecionando para:", redirectLink)

    return NextResponse.json({
      success: true,
      message: "Pagamento verificado com sucesso",
      redirectUrl: redirectLink,
      facebookPixelScript: facebookResult.script,
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar pagamento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar pagamento",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
