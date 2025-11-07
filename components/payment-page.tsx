"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Clock, ArrowLeft, CheckCircle, Lock, Shield, CheckCircle2 } from "lucide-react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [buttonCountdown, setButtonCountdown] = useState(75) // 75 segundos
  const [purchaseEventSent, setPurchaseEventSent] = useState(false)
  const [qrCodeBase64, setQrCodeBase64] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [])

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setButtonCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          setIsButtonEnabled(true)
          setShowButton(true) // Show button when countdown finishes
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [])

  useEffect(() => {
    const qrCodeParam = searchParams.get("qr_code")
    const qrCodeBase64Param = searchParams.get("qr_code_base64")

    console.log("[v0] QR Code from URL:", qrCodeParam ? "presente" : "ausente")
    console.log("[v0] QR Code Base64 from URL:", qrCodeBase64Param ? "presente" : "ausente")

    if (qrCodeParam) setQrCode(qrCodeParam)
    if (qrCodeBase64Param) setQrCodeBase64(qrCodeBase64Param)
  }, [searchParams])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode)
    setVerificationMessage("Código PIX copiado!")

    setTimeout(() => setVerificationMessage(""), 3000)
  }

  const handlePaymentVerification = async () => {
    setIsVerifying(true)
    setVerificationMessage("Enviando confirmação...")

    if (!purchaseEventSent && typeof window !== "undefined" && (window as any).fbq) {
      const productData = {
        value: Number.parseFloat(searchParams.get("amount") || "0"),
        currency: "BRL",
      }
      ;(window as any).fbq("track", "Purchase", productData)
      setPurchaseEventSent(true)
      console.log("[v0] Purchase event sent before redirect")
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setVerificationMessage("Abrindo acesso...")
    window.open("https://nostalflix.vercel.app", "_blank")
    setIsVerifying(false)
    setVerificationMessage("Acesso aberto em uma nova aba!")

    setTimeout(() => setVerificationMessage(""), 3000)
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
              src="/images/design-mode/519028_1887158729%20%281%29(1).jpg"
              alt="Pagamento PIX Passo a Passo"
              className="w-full h-auto rounded-t-lg border-b border-slate-700"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-2 text-[rgba(0,255,50,1)]">PIX - Aprovação Imediata</h1>
            <p className="text-slate-300 text-sm">Escaneie o QR Code ou copie o código PIX</p>
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

            {showButton && (
              <Button
                onClick={handlePaymentVerification}
                disabled={!isButtonEnabled || isVerifying}
                className="w-full font-semibold py-3 bg-green-600 hover:bg-green-700 text-white"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {verificationMessage}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Já realizei o pagamento
                  </span>
                )}
              </Button>
            )}

            {verificationMessage && !isVerifying && (
              <div className="text-center text-sm text-yellow-400">{verificationMessage}</div>
            )}

            <div className="text-center text-sm text-slate-400">
              <p>A confirmação é automática e você será redirecionado para nosso aplicativo imediatamente!</p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-700 p-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Segurança Garantida</h3>
            </div>
            <p className="text-sm text-slate-400">Sua compra está 100% protegida</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg">
              <Lock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Pagamento Seguro</h4>
                <p className="text-xs text-slate-400">
                  Processamento via Mercado Pago com criptografia de dados bancários
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Acesso Imediato</h4>
                <p className="text-xs text-slate-400">
                  Após a confirmação do pagamento, você recebe o acesso automaticamente no email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Garantia de Satisfação</h4>
                <p className="text-xs text-slate-400">
                  Mais de 20.000 clientes satisfeitos. Suporte disponível para qualquer dúvida
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">Seus dados estão seguros e protegidos por criptografia SSL</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
