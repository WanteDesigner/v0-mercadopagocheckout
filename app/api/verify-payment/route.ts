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
    const facebookResponse = await fetch(`${request.headers.get("origin")}/api/facebook/track-purchase`, {
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

    const facebookResult = await facebookResponse.json()
    console.log("[v0] Facebook Purchase event result:", facebookResult)

    const driveLink = "https://drive.google.com/drive/folders/1CV0m6xnqh3j9tHiWorszRZfsCXUYtkGn"

    console.log("[v0] Pagamento verificado, Purchase event enviado, redirecionando para Google Drive")

    return NextResponse.json({
      success: true,
      message: "Pagamento verificado com sucesso",
      redirectUrl: driveLink,
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
