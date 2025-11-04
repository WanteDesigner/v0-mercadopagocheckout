import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API /api/emails/save - Recebendo requisição POST")

    const body = await request.json()
    console.log("[v0] Body recebido:", JSON.stringify(body, null, 2))

    const { email, amount, products, timestamp } = body

    if (!email) {
      console.error("[v0] Email não fornecido")
      return NextResponse.json({ success: false, error: "Email é obrigatório" }, { status: 400 })
    }

    console.log("[v0] Salvando email na lista:", email)
    console.log("[v0] Valor:", amount)
    console.log("[v0] Produtos:", products)

    const dataDir = path.join(process.cwd(), "data")
    const filePath = path.join(dataDir, "informacoes-checkout.txt")

    console.log("[v0] Diretório de dados:", dataDir)
    console.log("[v0] Caminho do arquivo:", filePath)

    // Criar diretório se não existir
    if (!existsSync(dataDir)) {
      console.log("[v0] Criando diretório:", dataDir)
      await mkdir(dataDir, { recursive: true })
    }

    // Ler conteúdo existente ou criar novo
    let content = ""
    if (existsSync(filePath)) {
      console.log("[v0] Arquivo existe, lendo conteúdo...")
      content = await readFile(filePath, "utf-8")
      console.log("[v0] Conteúdo atual tem", content.length, "caracteres")
    } else {
      console.log("[v0] Arquivo não existe, criando novo...")
      content = `========================================
INFORMAÇÕES DE CHECKOUT - NOSTALFLIX
========================================
Arquivo criado para registrar todos os checkouts realizados
Formato: Data/Hora | E-mail | Valor Total | Produtos Selecionados
========================================

`
    }

    const date = new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const productsText = Array.isArray(products) ? products.join(" + ") : products
    const newEntry = `[${date}]
E-mail: ${email}
Valor: R$ ${amount.toFixed(2)}
Produtos: ${productsText}
----------------------------------------

`

    console.log("[v0] Nova entrada:", newEntry)

    content += newEntry

    // Salvar arquivo
    console.log("[v0] Salvando arquivo...")
    await writeFile(filePath, content, "utf-8")

    console.log("[v0] ✅ Informações de checkout salvas com sucesso!")

    return NextResponse.json({
      success: true,
      message: "Informações de checkout salvas com sucesso",
      file: filePath,
    })
  } catch (error) {
    console.error("[v0] ❌ Erro ao salvar informações:", error)
    console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "N/A")
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao salvar informações",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// Endpoint para baixar o arquivo
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "informacoes-checkout.txt")

    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "Arquivo não encontrado" }, { status: 404 })
    }

    const content = await readFile(filePath, "utf-8")

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="informacoes-checkout.txt"',
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao ler arquivo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao ler arquivo",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
