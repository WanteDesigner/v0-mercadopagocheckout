"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, MessageCircle, Mail, Phone } from "lucide-react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [buttonCountdown, setButtonCountdown] = useState(75)
  const [purchaseEventSent, setPurchaseEventSent] = useState(false)
  const [qrCodeBase64, setQrCodeBase64] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false)
  const [whatsAppCountdown, setWhatsAppCountdown] = useState(70)
  const [amount, setAmount] = useState(0)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setButtonCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          setIsButtonEnabled(true)
          setShowButton(true)
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
    const amountFromStorage = Number.parseFloat(sessionStorage.getItem("payment_amount") || "0") || 0
    const productsFromStorage = JSON.parse(sessionStorage.getItem("payment_products") || "[]")

    if (qrCodeFromStorage) setQrCode(qrCodeFromStorage)
    if (qrCodeBase64FromStorage) setQrCodeBase64(qrCodeBase64FromStorage)
    setAmount(amountFromStorage)
    setProducts(productsFromStorage)
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
        const email = sessionStorage.getItem("payment_email") || ""

        const productData = {
          value: amount,
          currency: "BRL",
        }

        const eventId = `purchase_${searchParams.get("payment_id")}_${Date.now()}`

        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq("track", "Purchase", productData, { eventID: eventId })
        }

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

        if (!purchaseResponse.ok) {
          console.error("[v0] Erro ao enviar Purchase via API:", await purchaseResponse.text())
        }

        setPurchaseEventSent(true)
      } catch (error) {
        console.error("[v0] Erro ao enviar Purchase event:", error)
      }
    }

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">Pagamento via PIX</h1>
            <p className="text-sm text-blue-600">Font: 0f1da2948d7b40</p>
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

        {showButton && (
          <Button
            onClick={handlePaymentVerification}
            disabled={!isButtonEnabled || isVerifying}
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

        {showWhatsAppButton && (
          <Button
            onClick={handleWhatsAppRedirect}
            className="w-full font-semibold py-3 bg-green-500 hover:bg-green-600 text-white mb-4"
          >
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Enviar Comprovante via WhatsApp
            </span>
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
