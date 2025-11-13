"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, Mail, Phone } from "lucide-react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [purchaseEventSent, setPurchaseEventSent] = useState(false)
  const [qrCodeBase64, setQrCodeBase64] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [amount, setAmount] = useState(0)
  const [products, setProducts] = useState<any[]>([])
  const [paymentApproved, setPaymentApproved] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)

  useEffect(() => {
    console.log("[v0] Retrieving payment data from sessionStorage...")

    const qrCodeFromStorage = sessionStorage.getItem("payment_qr_code")
    const qrCodeBase64FromStorage = sessionStorage.getItem("payment_qr_code_base64")
    const amountFromStorage = Number.parseFloat(sessionStorage.getItem("payment_amount") || "0") || 0
    const productsFromStorage = JSON.parse(sessionStorage.getItem("payment_products") || "[]")

    console.log("[v0] QR Code retrieved:", qrCodeFromStorage ? "Yes" : "No")
    console.log(
      "[v0] QR Code Base64 retrieved:",
      qrCodeBase64FromStorage ? `Yes (${qrCodeBase64FromStorage.substring(0, 50)}...)` : "No",
    )
    console.log("[v0] Amount retrieved:", amountFromStorage)
    console.log("[v0] Products retrieved:", productsFromStorage)

    if (qrCodeFromStorage) setQrCode(qrCodeFromStorage)
    if (qrCodeBase64FromStorage) {
      const base64Data = qrCodeBase64FromStorage.startsWith("data:image")
        ? qrCodeBase64FromStorage
        : `data:image/png;base64,${qrCodeBase64FromStorage}`
      setQrCodeBase64(base64Data)
      console.log("[v0] QR Code Base64 set successfully")
    }
    setAmount(amountFromStorage)
    setProducts(productsFromStorage)
  }, [])

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    if (!paymentId) return

    const checkPaymentStatus = async () => {
      try {
        setIsCheckingPayment(true)
        console.log("[v0] Checking payment status for:", paymentId)

        const response = await fetch(`/api/pix/check-status?payment_id=${paymentId}`)
        const data = await response.json()

        console.log("[v0] Payment status:", data.status)

        if (data.status === "approved") {
          console.log("[v0] Payment approved! Showing confirmation button")
          setPaymentApproved(true)
          setIsCheckingPayment(false)

          if (!purchaseEventSent) {
            await sendPurchaseEvent()
          }
          return true
        }

        return false
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
        return false
      }
    }

    // Check immediately
    checkPaymentStatus()

    const interval = setInterval(async () => {
      const approved = await checkPaymentStatus()
      if (approved) {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [searchParams, purchaseEventSent])

  const sendPurchaseEvent = async () => {
    try {
      const email = sessionStorage.getItem("payment_email") || ""
      const phone = sessionStorage.getItem("payment_phone") || ""
      const eventId = `purchase_${searchParams.get("payment_id")}_${Date.now()}`

      console.log("[v0] Sending Purchase event with event_id:", eventId)

      if (typeof window !== "undefined" && (window as any).fbq) {
        ;(window as any).fbq(
          "track",
          "Purchase",
          {
            value: amount,
            currency: "BRL",
          },
          { eventID: eventId },
        )
        console.log("[v0] Purchase event sent via client-side fbq")
      }

      if (typeof window !== "undefined" && (window as any).ttq) {
        ;(window as any).ttq.track("CompletePayment", {
          value: amount,
          currency: "BRL",
          contents: products.map((p) => ({ content_name: p.name })),
        })
        console.log("[v0] Purchase event sent via client-side ttq")
      }

      const purchaseResponse = await fetch("/api/facebook/track-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: "Purchase",
          event_id: eventId,
          value: amount,
          currency: "BRL",
          products: products.map((p) => p.name),
          email: email,
          payment_id: searchParams.get("payment_id") || "",
        }),
      })

      if (!purchaseResponse.ok) {
        console.error("[v0] Error sending Purchase via Facebook API:", await purchaseResponse.text())
      } else {
        console.log("[v0] Purchase event sent via Facebook server-side API")
      }

      const tiktokResponse = await fetch("/api/tiktok/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: "CompletePayment",
          event_id: eventId,
          value: amount,
          currency: "BRL",
          products: products.map((p) => p.name),
          email: email,
          phone: phone,
          payment_id: searchParams.get("payment_id") || "",
        }),
      })

      if (!tiktokResponse.ok) {
        console.error("[v0] Error sending Purchase via TikTok API:", await tiktokResponse.text())
      } else {
        console.log("[v0] Purchase event sent via TikTok server-side API")
      }

      setPurchaseEventSent(true)
    } catch (error) {
      console.error("[v0] Error sending Purchase event:", error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode)
    setVerificationMessage("Código PIX copiado!")
    setTimeout(() => setVerificationMessage(""), 3000)
  }

  const handlePaymentVerification = async () => {
    setIsVerifying(true)
    setVerificationMessage("Abrindo acesso...")

    window.open("https://nostalflix.vercel.app", "_blank")

    setIsVerifying(false)
    setVerificationMessage("Acesso aberto em uma nova aba!")

    setTimeout(() => setVerificationMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">Pagamento via PIX</h1>
            <p className="text-sm text-blue-600">
              Font: {searchParams.get("payment_id")?.substring(0, 14) || "0f1da2948d7b40"}
            </p>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">Valor total</p>
            <p className="text-3xl font-bold text-blue-600">R$ {amount.toFixed(2)}</p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              {qrCodeBase64 ? (
                <img src={qrCodeBase64 || "/placeholder.svg"} alt="QR Code PIX" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Carregando QR Code...</p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mb-4">
            <Copy className="w-4 h-4 mr-2" />
            COPIAR CÓDIGO PIX
          </Button>

          {verificationMessage && <div className="text-center text-sm text-green-600 mb-4">{verificationMessage}</div>}

          {isCheckingPayment && !paymentApproved && (
            <div className="text-center text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Aguardando confirmação do pagamento...</span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Como pagar:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex">
                <span className="font-semibold mr-2">1.</span>
                <span>Abra o app do seu banco</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2">2.</span>
                <span>Escolha pagar via PIX com QR Code</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2">3.</span>
                <span>Escaneie o código acima ou cole o código PIX</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2">4.</span>
                <span>Confirme as informações e finalize o pagamento</span>
              </li>
            </ol>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Detalhes do Pedido</h3>

            {products.map((product: any, index: number) => (
              <div key={index} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 last:border-0">
                <img
                  src={product.image || "/placeholder.svg?height=60&width=60"}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                  <p className="text-xs text-gray-500">Qtd: {product.quantity || 1}</p>
                </div>
                <p className="text-sm font-semibold text-blue-600">R$ {(product.price || 0).toFixed(2)}</p>
              </div>
            ))}

            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm text-gray-800">R$ {amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-2 font-semibold">
              <span className="text-gray-800">Total:</span>
              <span className="text-blue-600">R$ {amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {paymentApproved && (
          <Button
            onClick={handlePaymentVerification}
            disabled={isVerifying}
            className="w-full font-semibold py-3 bg-green-600 hover:bg-green-700 text-white mb-4"
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-sm text-gray-600 mb-4">Problemas com o pagamento? Fale com a gente:</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:Designerprocurado@gmail.com"
              className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Mail className="w-4 h-4" />
              Designerprocurado@gmail.com
            </a>

            <a
              href="https://wa.me/5598984046294"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 text-sm"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
