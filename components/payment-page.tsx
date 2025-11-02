"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Clock, ArrowLeft, CheckCircle, Lock } from "lucide-react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [buttonCountdown, setButtonCountdown] = useState(30) // 30 segundos

  const paymentId = searchParams.get("payment_id")
  const externalReference = searchParams.get("external_reference")
  const qrCode = searchParams.get("qr_code")
  const qrCodeBase64 = searchParams.get("qr_code_base64")
  const userEmail = searchParams.get("email")
  const selectedProducts = searchParams.get("products")
    ? JSON.parse(decodeURIComponent(searchParams.get("products")!))
    : []
  const totalAmount = searchParams.get("amount") ? Number.parseFloat(searchParams.get("amount")!) : 10.0

  useEffect(() => {
    console.log("[v0] Página de pagamento carregada")
    console.log("[v0] Payment ID:", paymentId)
    console.log("[v0] QR Code presente:", !!qrCode)
    console.log("[v0] QR Code Base64 presente:", !!qrCodeBase64)
    console.log("[v0] Email:", userEmail)
    console.log("[v0] Produtos:", selectedProducts)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setButtonCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          setIsButtonEnabled(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [])

  const copyToClipboard = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode)
      alert("Código PIX copiado!")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePaymentVerification = async () => {
    if (!userEmail || !paymentId) {
      alert("Informações de pagamento não encontradas")
      return
    }

    setIsVerifying(true)
    setVerificationMessage("Verificando pagamento...")

    try {
      console.log("[v0] Verificando pagamento para:", userEmail)

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          paymentId: paymentId,
          products: selectedProducts,
          totalValue: totalAmount,
        }),
      })

      const result = await response.json()
      console.log("[v0] Resultado da verificação:", result)

      if (result.success) {
        setVerificationMessage("Pagamento confirmado! Redirecionando...")

        if (result.facebookPixelScript) {
          console.log("[v0] Executando Facebook Pixel Purchase event")
          const script = document.createElement("script")
          script.text = result.facebookPixelScript
          document.head.appendChild(script)
        }

        setTimeout(() => {
          console.log("[v0] Redirecionando para Google Drive:", result.redirectUrl)
          window.location.href = result.redirectUrl
        }, 1500)
      } else {
        setVerificationMessage("Erro ao verificar pagamento. Tente novamente.")
        setIsVerifying(false)
      }
    } catch (error) {
      console.error("[v0] Erro ao verificar pagamento:", error)
      setVerificationMessage("Erro ao verificar pagamento. Tente novamente.")
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" className="text-white hover:bg-slate-800" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-slate-800 border-slate-700 text-white p-6">
          <div className="mb-6 -mx-6 -mt-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/519028_1887158729%20%281%29-4c34ozB6T9QA3F4eL1UqU46Jpczyur.jpg"
              alt="Pagamento PIX Passo a Passo"
              className="w-full h-auto rounded-t-lg border-b border-slate-700"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-2">PIX - Aprovação Imediata</h1>
            <p className="text-slate-300 text-sm">Escaneie o QR Code ou copie o código PIX</p>
            <p className="text-yellow-400 text-xs mt-2">Chave PIX: designerprocurado@gmail.com</p>
          </div>

          <div className="space-y-4">
            {qrCodeBase64 ? (
              <div className="flex justify-center">
                <img
                  src={qrCodeBase64 || "/placeholder.svg"}
                  alt="QR Code PIX"
                  className="w-48 h-48 bg-white p-2 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-slate-400">Carregando QR Code...</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">Código PIX (Copia e Cola):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrCode || ""}
                  readOnly
                  className="flex-1 bg-slate-700 border-slate-600 text-white p-2 rounded text-xs"
                />
                <Button onClick={copyToClipboard} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Tempo restante:</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{formatTime(timeLeft)}</div>
            </div>

            <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-center">Instruções:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar com PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
                <li>Clique no botão abaixo após realizar o pagamento</li>
              </ol>
            </div>

            <Button
              onClick={handlePaymentVerification}
              disabled={!isButtonEnabled || isVerifying}
              className={`w-full font-semibold py-3 ${
                isButtonEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {verificationMessage}
                </span>
              ) : !isButtonEnabled ? (
                buttonCountdown > 15 ? (
                  <span className="flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Aguarde {buttonCountdown}s para confirmar o pagamento
                  </span>
                )
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Já realizei o pagamento
                </span>
              )}
            </Button>

            {verificationMessage && !isVerifying && (
              <div className="text-center text-sm text-yellow-400">{verificationMessage}</div>
            )}

            <div className="text-center text-sm text-slate-400">
              <p>Após confirmar o pagamento, você será redirecionado automaticamente</p>
              <p className="text-yellow-400 mt-2">Chave PIX: designerprocurado@gmail.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
