"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Clock, ArrowLeft, CheckCircle, Lock, Shield, CheckCircle2, MessageCircle } from "lucide-react"

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
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false)
  const [whatsAppCountdown, setWhatsAppCountdown] = useState(70)

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
    const qrCodeFromStorage = sessionStorage.getItem("payment_qr_code")
    const qrCodeBase64FromStorage = sessionStorage.getItem("payment_qr_code_base64")

    console.log("[v0] QR Code from sessionStorage:", qrCodeFromStorage ? "presente" : "ausente")
    console.log("[v0] QR Code Base64 from sessionStorage:", qrCodeBase64FromStorage ? "presente" : "ausente")

    if (qrCodeFromStorage) setQrCode(qrCodeFromStorage)
    if (qrCodeBase64FromStorage) setQrCodeBase64(qrCodeBase64FromStorage)
  }, [])

  useEffect(() => {
    const whatsAppTimer = setInterval(() => {
      setWhatsAppCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(whatsAppTimer)
          setShowWhatsAppButton(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(whatsAppTimer)
  }, [])

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

    if (!purchaseEventSent) {
      try {
        const amount = sessionStorage.getItem("payment_amount") || "0"
        const email = sessionStorage.getItem("payment_email") || ""
        const products = JSON.parse(sessionStorage.getItem("payment_products") || "[]")

        const productData = {
          value: Number.parseFloat(amount),
          currency: "BRL",
        }

        // Generate unique event_id for deduplication
        const eventId = `purchase_${searchParams.get("payment_id")}_${Date.now()}`

        console.log("[v0] Enviando Purchase event com event_id:", eventId)

        // Send client-side Facebook Pixel event with eventID
        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq("track", "Purchase", productData, { eventID: eventId })
          console.log("[v0] Purchase event sent via client-side fbq with eventID")
        }

        // Send server-side Facebook Conversions API event with matching event_id
        const purchaseResponse = await fetch("/api/facebook/track-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_name: "Purchase",
            event_id: eventId,
            value: productData.value,
            currency: productData.currency,
            products: products,
            email: email,
            payment_id: searchParams.get("payment_id") || "",
          }),
        })

        if (purchaseResponse.ok) {
          console.log("[v0] Purchase event sent via server-side API with event_id")
        } else {
          console.error("[v0] Erro ao enviar Purchase via API:", await purchaseResponse.text())
        }

        setPurchaseEventSent(true)
      } catch (error) {
        console.error("[v0] Erro ao enviar Purchase event:", error)
      }
    }

    // Wait for events to be sent before redirect
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setVerificationMessage("Abrindo acesso...")
    window.open("https://nostalflix.vercel.app", "_blank")
    setIsVerifying(false)
    setVerificationMessage("Acesso aberto em uma nova aba!")

    setTimeout(() => setVerificationMessage(""), 3000)
  }

  const handleWhatsAppRedirect = () => {
    const whatsappNumber = "5598984046294"
    const message = encodeURIComponent("Olá! Gostaria de enviar o comprovante de pagamento do meu pedido.")
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
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

            {showWhatsAppButton && (
              <Button
                onClick={handleWhatsAppRedirect}
                className="w-full font-semibold py-3 bg-green-500 hover:bg-green-600 text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Enviar Comprovante via WhatsApp
                </span>
              </Button>
            )}

            {verificationMessage && !isVerifying && (
              <div className="text-center text-sm text-yellow-400">{verificationMessage}</div>
            )}

            <div className="text-center text-sm text-slate-400">
              <p>
                A confirmação é automática e você será redirecionado para nosso aplicativo imediatamente após o
                pagamento!
              </p>
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
                <h4 className="text-sm font-semibold text-white">Pagamento 100% Seguro</h4>
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
                  Mais de 5.970 clientes já estão satisfeitos com nossa plataforma. Suporte disponível 24h para qualquer
                  dúvida
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
