import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { email, amount, products, timestamp } = await request.json()

    console.log("[v0] Salvando email na lista:", email)

    // Caminho para o arquivo de emails
    const dataDir = path.join(process.cwd(), "data")
    const filePath = path.join(dataDir, "lista de emails.txt")

    // Criar diretório se não existir
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Ler conteúdo existente ou criar novo
    let content = ""
    if (existsSync(filePath)) {
      content = await readFile(filePath, "utf-8")
    } else {
      content = "=== LISTA DE EMAILS - NOSTALFLIX ===\n\n"
    }

    // Adicionar novo email com informações
    const date = new Date(timestamp).toLocaleString("pt-BR")
    const productsText = Array.isArray(products) ? products.join(", ") : products
    const newEntry = `${date} | ${email} | R$ ${amount.toFixed(2)} | ${productsText}\n`

    content += newEntry

    // Salvar arquivo
    await writeFile(filePath, content, "utf-8")

    console.log("[v0] Email salvo com sucesso no arquivo lista de emails.txt")

    return NextResponse.json({ success: true, message: "Email salvo com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao salvar email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao salvar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// Endpoint para baixar o arquivo
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "lista de emails.txt")

    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "Arquivo não encontrado" }, { status: 404 })
    }

    const content = await readFile(filePath, "utf-8")

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="lista de emails.txt"',
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
