"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"

export default function CheckoutPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showPopup, setShowPopup] = useState(false)
  const [currentBuyer, setCurrentBuyer] = useState("")
  const [usersOnline, setUsersOnline] = useState(47)
  const [statusDownloads, setStatusDownloads] = useState(95)
  const [statusOnline, setStatusOnline] = useState(50)
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true)
  const [selectedBumps, setSelectedBumps] = useState({
    formiga: false,
    picapau: false,
    jetsons: false,
    luluzinha: false,
    caverna: false,
    tom: false,
    thundercats: false,
    shera: false,
  })
  const [downloadsToday, setDownloadsToday] = useState(2850) // Declare setDownloadsToday

  const buyers = [
    "Helena, Goiânia, GO acabou de comprar.",
    "João, São Paulo, SP acabou de comprar.",
    "Maria, Rio de Janeiro, RJ acabou de comprar.",
    "Pedro, Belo Horizonte, MG acabou de comprar.",
  ]

  const testimonials = [
    {
      name: "Mariana Silva",
      location: "Brasil",
      rating: 5,
      comment: "Gente, eu chorei assistindo o especial de Natal 😭 parecia que eu tinha 8 anos de novo ❤️",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariana%20Silva-PTUxUhOD7ILGPw5huzMChcRd7vM0cx.jpg",
    },
    {
      name: "Fernanda Costa",
      location: "Brasil",
      rating: 5,
      comment: "Mostrei pro meu filho e ele ficou viciado no Snoopy kkk agora ele entende minha infância 😂",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fernanda%20Costa-25NTRUQGYcILIgO8jccZlV6xRkXYvC.png",
    },
    {
      name: "Roberto Oliveira",
      location: "Brasil",
      rating: 5,
      comment: "Revivi tantas lembranças boas… esse desenho tem uma paz que a gente não encontra mais 😌",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Roberto%20Oliveira-LbFDH1U0LMllrIMqxeH5Bx64t7h2Lv.jpg",
    },
    {
      name: "Juliana Mendes",
      location: "Brasil",
      rating: 5,
      comment: "Não acredito que achei isso completo e dublado! Que nostalgia 🥹",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Juliana%20Mendes-n8aR2IwQbjJN3rTHjPbMmhhKziWHeH.jpg",
    },
    {
      name: "Patricia",
      location: "Brasil",
      rating: 5,
      comment: "Eu e meu marido assistindo juntos, parecia que a gente tinha voltado pros anos 90 💛",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patricia-c84vW21ws5u0MDfVtgXVEYSkZ93Znc.jpeg",
    },
    {
      name: "Camila Rocha",
      location: "Brasil",
      rating: 5,
      comment: "O de Natal continua sendo o melhor, impossível não se emocionar 🎄",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Camila%20Rocha-HWhLh1ZVP90cP5o6wsC66SOmQ8FTR1.jpg",
    },
  ]

  const selectedProducts = ["Desenho Completo: A Turma de Charlie Brown e Snoopy"]

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const showBuyerPopup = () => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)]
      setCurrentBuyer(randomBuyer)
      setShowPopup(true)
      playNotificationSound()

      setTimeout(
        () => {
          setShowPopup(false)
        },
        Math.random() * 2000 + 8000,
      )
    }

    const interval = setInterval(showBuyerPopup, Math.random() * 2000 + 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const animateNumbers = () => {
      setDownloadsToday((prev) => {
        const variation = Math.floor(Math.random() * 3) - 1
        const newValue = prev + variation
        return Math.max(2840, Math.min(2860, newValue))
      })

      setUsersOnline((prev) => {
        const variation = Math.floor(Math.random() * 3) - 1
        const newValue = prev + variation
        return Math.max(45, Math.min(52, newValue))
      })
    }

    const interval = setInterval(animateNumbers, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const animateStatusNumbers = () => {
      setStatusDownloads((prev) => {
        const variation = Math.floor(Math.random() * 3) - 1
        const newValue = prev + variation
        return Math.max(85, Math.min(125, newValue))
      })

      setStatusOnline((prev) => {
        const variation = Math.floor(Math.random() * 3) - 1
        const newValue = prev + variation
        return Math.max(48, Math.min(55, newValue))
      })
    }

    const interval = setInterval(animateStatusNumbers, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log("[v0] Página de checkout carregada")

    const hasInitiateCheckoutFired = sessionStorage.getItem("initiateCheckoutFired")
    const lastFiredTime = sessionStorage.getItem("initiateCheckoutFiredTime")
    const currentTime = Date.now()

    // Reset flag if more than 1 hour has passed
    if (lastFiredTime && currentTime - Number.parseInt(lastFiredTime) > 3600000) {
      sessionStorage.removeItem("initiateCheckoutFired")
      sessionStorage.removeItem("initiateCheckoutFiredTime")
    }

    if (hasInitiateCheckoutFired) {
      console.log("[v0] InitiateCheckout já foi enviado nesta sessão, pulando...")
      return
    }

    const sendInitiateCheckout = async () => {
      try {
        const totalValue = calculateTotal()
        const products = ["Desenho Completo: A turma de Charlie Brown"]

        const eventId = `initiate_checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        console.log("[v0] Enviando evento InitiateCheckout com event_id:", eventId)

        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq(
            "track",
            "InitiateCheckout",
            {
              value: totalValue,
              currency: "BRL",
              content_ids: products.map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "_")),
              content_type: "product",
              num_items: products.length,
            },
            { eventID: eventId },
          )
          console.log("[v0] InitiateCheckout event sent via client-side fbq with eventID")
        }

        await fetch("/api/facebook/track-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_name: "InitiateCheckout",
            event_id: eventId,
            value: totalValue,
            currency: "BRL",
            products: products,
            email: "",
            payment_id: `checkout_${Date.now()}`,
          }),
        })

        console.log("[v0] InitiateCheckout event sent via server-side API with event_id")

        sessionStorage.setItem("initiateCheckoutFired", "true")
        sessionStorage.setItem("initiateCheckoutFiredTime", currentTime.toString())
      } catch (error) {
        console.error("[v0] Erro ao enviar InitiateCheckout:", error)
      }
    }

    sendInitiateCheckout()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateTotal = () => {
    let total = 10.0
    if (selectedBumps.formiga) total += 5.0
    if (selectedBumps.picapau) total += 5.0
    if (selectedBumps.jetsons) total += 5.0
    if (selectedBumps.luluzinha) total += 5.0
    if (selectedBumps.caverna) total += 5.0
    if (selectedBumps.tom) total += 5.0
    if (selectedBumps.thundercats) total += 5.0
    if (selectedBumps.shera) total += 5.0
    return total
  }

  const toggleBump = (bump: keyof typeof selectedBumps) => {
    setSelectedBumps((prev) => ({
      ...prev,
      [bump]: !prev[bump],
    }))
  }

  const handleCheckout = async () => {
    if (!email) {
      alert("Por favor, insira seu e-mail")
      return
    }
    if (!name) {
      alert("Por favor, insira seu nome completo")
      return
    }
    if (!phone) {
      alert("Por favor, insira seu telefone")
      return
    }

    setIsProcessing(true)
    console.log("[v0] Iniciando processo de checkout...")
    console.log("[v0] Email do cliente:", email)

    try {
      const productsList = [
        {
          name: "Desenho Completo: A turma de Charlie Brown",
          image: "/images/design-mode/519028_7943916241.jpg",
          price: 10.0,
          quantity: 1,
        },
      ]

      if (selectedBumps.formiga) {
        productsList.push({
          name: "Desenho Completo: A Formiga Atômica",
          image: "/images/design-mode/formiga-atomica-4(1).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.thundercats) {
        productsList.push({
          name: "Desenho Completo: Thundercats",
          image: "/images/design-mode/unnamed(2).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.jetsons) {
        productsList.push({
          name: "Desenho Completo: Os Jetsons",
          image:
            "/images/design-mode/MV5BN2NlYjMzYjItODNjYS00ZTEwLThmZmUtM2UwY2NkMzc2YjMxXkEyXkFqcGc@._V1_FMjpg_UX1000_(1).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.picapau) {
        productsList.push({
          name: "Desenho Completo – Pica-Pau Coleção Clássica",
          image: "/images/design-mode/c5b05d90d10be76ed2609e7046db7736(2).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.caverna) {
        productsList.push({
          name: "Desenho Completo: A Caverna do Dragão",
          image: "/images/design-mode/5951896(2).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.shera) {
        productsList.push({
          name: "Desenho Completo: She-ra",
          image: "/images/design-mode/image-0(2).jpeg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.luluzinha) {
        productsList.push({
          name: "Desenho Completo – Luluzinha",
          image: "/images/design-mode/channels4_profile(1).jpg",
          price: 5.0,
          quantity: 1,
        })
      }
      if (selectedBumps.tom) {
        productsList.push({
          name: "Desenho Completo – As aventuras de Tom e Jerry",
          image: "/images/design-mode/Tom_and_Jerry.jpeg",
          price: 5.0,
          quantity: 1,
        })
      }

      const productNames = productsList.map((p) => p.name)

      const paymentData = {
        email,
        name,
        phone,
        amount: calculateTotal(),
        description: productNames.join(" + "),
        selectedProducts: productNames,
      }

      console.log("[v0] Dados do pagamento:", paymentData)
      console.log("[v0] Enviando requisição para /api/pix/create...")

      const response = await fetch("/api/pix/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      console.log("[v0] Status da resposta:", response.status)
      console.log("[v0] Headers da resposta:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro HTTP:", response.status, errorText)
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`)
      }

      const responseText = await response.text()
      console.log("[v0] Resposta bruta da API:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[v0] Erro ao fazer parse JSON:", parseError)
        throw new Error("Resposta inválida do servidor")
      }

      console.log("[v0] Dados parseados da resposta:", data)

      if (data.error) {
        console.error("[v0] Erro retornado pela API:", data.error, data.details)
        throw new Error(data.details || data.error)
      }

      if (!data.payment_id) {
        console.error("[v0] payment_id não encontrado na resposta:", data)
        throw new Error("ID do pagamento não foi gerado")
      }

      if (!data.qr_code && !data.qr_code_base64) {
        console.error("[v0] QR Code não encontrado na resposta:", data)
        throw new Error("QR Code não foi gerado")
      }

      console.log("[v0] PIX criado com sucesso!")
      console.log("[v0] Payment ID:", data.payment_id)
      console.log("[v0] QR Code presente:", !!data.qr_code)
      console.log("[v0] QR Code Base64 presente:", !!data.qr_code_base64)

      try {
        const totalValue = calculateTotal()

        const eventId = `add_payment_info_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        console.log("[v0] Enviando evento AddPaymentInfo após geração do PIX com event_id:", eventId)

        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq(
            "track",
            "AddPaymentInfo",
            {
              value: totalValue,
              currency: "BRL",
              content_ids: productNames.map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "_")),
              content_type: "product",
              num_items: productNames.length,
            },
            { eventID: eventId },
          )
          console.log("[v0] AddPaymentInfo event sent via client-side fbq with eventID")
        }

        await fetch("/api/facebook/track-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_name: "AddPaymentInfo",
            event_id: eventId,
            value: totalValue,
            currency: "BRL",
            products: productNames,
            email: email,
            payment_id: data.payment_id,
          }),
        })

        console.log("[v0] AddPaymentInfo event sent via server-side API with event_id")
      } catch (error) {
        console.error("[v0] Erro ao enviar AddPaymentInfo:", error)
      }

      console.log("[v0] Redirecionando para página de pagamento...")

      sessionStorage.setItem("payment_qr_code", data.qr_code || "")
      sessionStorage.setItem("payment_qr_code_base64", data.qr_code_base64 || "")
      sessionStorage.setItem("payment_email", email)
      sessionStorage.setItem("payment_products", JSON.stringify(productsList))
      sessionStorage.setItem("payment_amount", calculateTotal().toString())

      const params = new URLSearchParams({
        payment_id: data.payment_id,
        external_reference: data.external_reference || "",
      })

      console.log("[v0] URL de redirecionamento:", `/payment?${params.toString()}`)
      window.location.href = `/payment?${params.toString()}`
    } catch (error) {
      console.error("[v0] Erro ao processar pagamento:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      alert(`Erro ao processar pagamento: ${errorMessage}. Tente novamente.`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#00A9BC" }}>
      {/* Red countdown banner */}
      <div className="bg-red-600 py-3 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-white text-xs sm:text-sm md:text-base">
            ⏰ Oferta por tempo limitado{" "}
            <span className="font-bold text-base sm:text-lg ml-2">{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>

      {/* Hero image */}
      <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          <img
            src="/images/design-mode/519028_7943916241%20%281%29.jpg"
            alt="Parabéns - A turma de Charlie Brown"
            className="w-full rounded-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Order Summary */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Resumo do Pedido</h3>
              {isOrderSummaryOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isOrderSummaryOpen && (
              <div className="px-4 sm:px-6 pb-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src="/images/design-mode/01.jpg"
                    alt="Charlie Brown"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                      Pacote Premium: A Turma de Charlie Brown e Snoopy
                    </h4>
                    <p className="text-lg sm:text-xl font-bold text-green-600 mt-1">R$ 10,00</p>
                    <p className="text-xs text-gray-500 mt-1">à vista no PIX</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Identificação</h3>
            </div>

            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
              />

              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
              />

              <div className="flex gap-2">
                <div className="w-16 sm:w-20">
                  <Input
                    type="text"
                    value="+55"
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-600 text-center text-sm sm:text-base"
                  />
                </div>
                <Input
                  type="tel"
                  placeholder="(DDD) 90000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Aproveite essas ofertas especiais!
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {/* Luluzinha */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.luluzinha}
                    onChange={() => toggleBump("luluzinha")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/channels4_profile(1).jpg"
                    alt="Luluzinha"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: Luluzinha</h3>
                    <p className="text-xs text-gray-600">
                      Reviva as aventuras de Luluzinha e sua turma — um desenho leve, engraçado e cheio de inocência.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("luluzinha")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tom e Jerry */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.tom}
                    onChange={() => toggleBump("tom")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/Tom_and_Jerry.jpeg"
                    alt="Tom e Jerry"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: Tom e Jerry</h3>
                    <p className="text-xs text-gray-600">
                      Relembre as perseguições e trapalhadas de Tom e Jerry — o desenho mais divertido!
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("tom")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Os Jetsons */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.jetsons}
                    onChange={() => toggleBump("jetsons")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/MV5BN2NlYjMzYjItODNjYS00ZTEwLThmZmUtM2UwY2NkMzc2YjMxXkEyXkFqcGc%40._V1_FMjpg_UX1000_(1).jpg"
                    alt="Os Jetsons"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: Os Jetsons</h3>
                    <p className="text-xs text-gray-600">
                      A família mais divertida e futurista da TV! Todos os episódios dublados.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("jetsons")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Formiga Atômica */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.formiga}
                    onChange={() => toggleBump("formiga")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/formiga-atomica-4(1).jpg"
                    alt="Formiga Atômica"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">
                      Desenho Completo: A Formiga Atômica
                    </h3>
                    <p className="text-xs text-gray-600">
                      O herói mais pequeno e mais poderoso da TV voltou! Reviva as aventuras explosivas.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("formiga")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pica-Pau */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.picapau}
                    onChange={() => toggleBump("picapau")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/c5b05d90d10be76ed2609e7046db7736(2).jpg"
                    alt="Pica-Pau"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: Pica-Pau</h3>
                    <p className="text-xs text-gray-600">
                      O pássaro mais maluco do mundo está de volta! Todos os episódios clássicos.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("picapau")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Caverna do Dragão */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.caverna}
                    onChange={() => toggleBump("caverna")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/5951896(2).jpg"
                    alt="Caverna do Dragão"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">
                      Desenho Completo: A Caverna do Dragão
                    </h3>
                    <p className="text-xs text-gray-600">
                      A aventura épica que todos queriam ver o final! Todos os episódios dublados.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("caverna")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* Thundercats */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.thundercats}
                    onChange={() => toggleBump("thundercats")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/unnamed(2).jpg"
                    alt="Thundercats"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: Thundercats</h3>
                    <p className="text-xs text-gray-600">
                      Os guerreiros felinos mais épicos dos anos 80! Todos os episódios dublados.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("thundercats")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>

              {/* She-ra */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBumps.shera}
                    onChange={() => toggleBump("shera")}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 flex-shrink-0 mt-1"
                  />
                  <img
                    src="/images/design-mode/image-0(2).jpeg"
                    alt="She-ra"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Desenho Completo: She-ra</h3>
                    <p className="text-xs text-gray-600">
                      A heroína que marcou uma era está de volta! Reviva as batalhas épicas.
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">R$ 5,00</p>
                    <Button
                      onClick={() => toggleBump("shera")}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 w-full sm:w-auto"
                    >
                      Adicionar oferta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Forma de pagamento</label>
                <div className="border-2 border-cyan-500 rounded-lg p-3 flex items-center justify-center gap-2 bg-cyan-50">
                  <svg className="w-5 h-5 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">PIX</span>
                </div>
              </div>

              {/* Payment Info Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-orange-900 mb-2 text-xs sm:text-sm">
                  Informações sobre o pagamento via PIX
                </h4>
                <p className="text-xs sm:text-sm text-orange-800 mb-1">
                  O pagamento é instantâneo e liberação imediata
                </p>
                <p className="text-xs sm:text-sm text-orange-800 mb-2">
                  Ao clicar em "Finalizar compra" você será encaminhado para um ambiente seguro
                </p>
                <p className="text-sm sm:text-base font-bold text-orange-900">
                  Valor à vista: R$ {calculateTotal().toFixed(2)}
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 text-sm sm:text-base transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Gerando PIX...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-sm sm:text-base">FINALIZAR COMPRA</span>
                  </div>
                )}
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-6 sm:mb-8 px-2">
            Veja o que nossos clientes estão dizendo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                      <div className="flex gap-0.5 sm:gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{testimonial.location}</p>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{testimonial.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-3 shadow-lg z-50">
          <div className="max-w-lg mx-auto flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-xs sm:text-sm font-medium">{currentBuyer}</span>
          </div>
        </div>
      )}
    </div>
  )
}
