import { type NextRequest, NextResponse } from "next/server"

const PIX_KEY = "designerprocurado@gmail.com"
const MERCHANT_NAME = "NOSTALFLIX"
const MERCHANT_CITY = "SAO PAULO"

// Função para calcular CRC16-CCITT
function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0")
}

// Função para criar um campo PIX
function createPixField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0")
  return `${id}${length}${value}`
}

// Função para gerar payload PIX manualmente
function generatePixPayload(
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number,
  transactionId: string,
): string {
  // Campo 00: Payload Format Indicator
  let payload = createPixField("00", "01")

  // Campo 26: Merchant Account Information
  const gui = createPixField("00", "BR.GOV.BCB.PIX")
  const key = createPixField("01", pixKey)
  const merchantAccount = gui + key
  payload += createPixField("26", merchantAccount)

  // Campo 52: Merchant Category Code
  payload += createPixField("52", "0000")

  // Campo 53: Transaction Currency (986 = BRL)
  payload += createPixField("53", "986")

  // Campo 54: Transaction Amount
  payload += createPixField("54", amount.toFixed(2))

  // Campo 58: Country Code
  payload += createPixField("58", "BR")

  // Campo 59: Merchant Name
  payload += createPixField("59", merchantName)

  // Campo 60: Merchant City
  payload += createPixField("60", merchantCity)

  // Campo 62: Additional Data Field Template
  const txId = createPixField("05", transactionId.substring(0, 25))
  payload += createPixField("62", txId)

  // Campo 63: CRC16
  payload += "6304"
  const crcValue = crc16(payload)
  payload += crcValue

  return payload
}

// Função para gerar QR Code usando API externa
async function generateQRCodeBase64(payload: string): Promise<string> {
  try {
    // Usar API do QR Server para gerar QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(payload)}`
    const response = await fetch(qrUrl)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return `data:image/png;base64,${base64}`
  } catch (error) {
    console.error("[v0] Erro ao gerar QR Code:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, amount, description, selectedProducts } = await request.json()

    console.log("[v0] === INÍCIO DA CRIAÇÃO DO PIX ===")
    console.log("[v0] Email do cliente:", email)
    console.log("[v0] Nome:", name)
    console.log("[v0] Telefone:", phone)
    console.log("[v0] Valor:", amount)
    console.log("[v0] Descrição:", description)

    // Save email to list
    try {
      await fetch(`${request.nextUrl.origin}/api/emails/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          products: selectedProducts || [description],
          timestamp: Date.now(),
        }),
      })
      console.log("[v0] Email salvo na lista com sucesso")
    } catch (error) {
      console.error("[v0] Erro ao salvar email na lista:", error)
    }

    const externalReference = `nostalflix_${Date.now()}_${email.replace("@", "_").replace(/\./g, "_")}`
    const paymentId = `pix_${Date.now()}`

    console.log("[v0] Gerando PIX payload...")
    const pixPayload = generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount, externalReference)
    
    console.log("[v0] Gerando QR Code...")
    const qrCodeBase64 = await generateQRCodeBase64(pixPayload)

    const responseData = {
      payment_id: paymentId,
      external_reference: externalReference,
      status: "pending",
      qr_code: pixPayload,
      qr_code_base64: qrCodeBase64,
      amount: amount,
      email: email,
      products: selectedProducts,
    }

    console.log("[v0] PIX criado com sucesso")
    console.log("[v0] Payment ID:", paymentId)
    console.log("[v0] === FIM DA CRIAÇÃO DO PIX ===")

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("[v0] === ERRO NA CRIAÇÃO DO PIX ===")
    console.error("[v0] Erro:", error)
    console.error("[v0] Stack:", error instanceof Error ? error.stack : "N/A")
    return NextResponse.json(
      {
        error: "Erro ao processar pagamento",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
