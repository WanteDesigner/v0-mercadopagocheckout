"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, CheckCircle, AlarmClock, Star } from "lucide-react"

export default function CheckoutPage() {
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showPopup, setShowPopup] = useState(false)
  const [currentBuyer, setCurrentBuyer] = useState("")
  const [downloadsToday, setDownloadsToday] = useState(2847)
  const [usersOnline, setUsersOnline] = useState(47)
  const [statusDownloads, setStatusDownloads] = useState(95)
  const [statusOnline, setStatusOnline] = useState(50)
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

  const buyers = [
    "João S. acabou de comprar",
    "Maria L. acabou de comprar",
    "Pedro R. acabou de comprar",
    "Ana C. acabou de comprar",
    "Carlos M. acabou de comprar",
    "Lucia F. acabou de comprar",
    "Rafael T. acabou de comprar",
    "Beatriz O. acabou de comprar",
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

        console.log("[v0] Enviando evento InitiateCheckout")

        // Send client-side Facebook Pixel event
        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq("track", "InitiateCheckout", {
            value: totalValue,
            currency: "BRL",
            content_ids: products.map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "_")),
            content_type: "product",
            num_items: products.length,
          })
          console.log("[v0] InitiateCheckout event sent via client-side fbq")
        }

        // Send server-side Facebook Conversions API event
        await fetch("/api/facebook/track-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_name: "InitiateCheckout",
            value: totalValue,
            currency: "BRL",
            products: products,
            email: "",
            payment_id: `checkout_${Date.now()}`,
          }),
        })

        console.log("[v0] InitiateCheckout event sent via server-side API")

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

    setIsProcessing(true)
    console.log("[v0] Iniciando processo de checkout...")
    console.log("[v0] Email do cliente:", email)

    try {
      const products = ["Desenho Completo: A turma de Charlie Brown"]
      if (selectedBumps.formiga) products.push("Desenho Completo: A Formiga Atômica")
      if (selectedBumps.thundercats) products.push("Desenho Completo: Thundercats")
      if (selectedBumps.jetsons) products.push("Desenho Completo: Os Jetsons")
      if (selectedBumps.picapau) products.push("Desenho Completo – Pica-Pau Coleção Clássica")
      if (selectedBumps.caverna) products.push("Desenho Completo: A Caverna do Dragão")
      if (selectedBumps.shera) products.push("Desenho Completo: She-ra")
      if (selectedBumps.luluzinha) products.push("Desenho Completo – Luluzinha")
      if (selectedBumps.tom) products.push("Desenho Completo – As aventuras de Tom e Jerry")

      const paymentData = {
        email,
        amount: calculateTotal(),
        description: products.join(" + "),
        selectedProducts: products,
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
        console.log("[v0] Enviando evento AddPaymentInfo após geração do PIX")

        // Send client-side Facebook Pixel event
        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq("track", "AddPaymentInfo", {
            value: totalValue,
            currency: "BRL",
            content_ids: products.map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "_")),
            content_type: "product",
            num_items: products.length,
          })
          console.log("[v0] AddPaymentInfo event sent via client-side fbq")
        }

        // Send server-side Facebook Conversions API event
        await fetch("/api/facebook/track-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_name: "AddPaymentInfo",
            value: totalValue,
            currency: "BRL",
            products: products,
            email: email,
            payment_id: data.payment_id,
          }),
        })

        console.log("[v0] AddPaymentInfo event sent via server-side API")
      } catch (error) {
        console.error("[v0] Erro ao enviar AddPaymentInfo:", error)
      }

      console.log("[v0] Redirecionando para página de pagamento...")

      const params = new URLSearchParams({
        payment_id: data.payment_id,
        external_reference: data.external_reference || "",
        qr_code: data.qr_code || "",
        qr_code_base64: data.qr_code_base64 || "",
        email: email,
        products: JSON.stringify(products),
        amount: calculateTotal().toString(),
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
    <div
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative"
      style={{ backgroundColor: "#14a0b9" }}
    >
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="bg-red-600 rounded-lg p-2 sm:p-4 flex items-center justify-center gap-2 sm:gap-3 shadow-lg">
          <AlarmClock className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
          <div className="text-white text-center">
            <span className="text-lg sm:text-xl font-bold">{formatTime(timeLeft)}</span>
            <span className="ml-2 sm:ml-3 text-xs sm:text-sm leading-7">Aproveite essa Super Promoção </span>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/images/design-mode/519028_7943916241.jpg"
            alt="Desenho Completo: A Turma de Charlie Brown e Snoopy"
            className="w-full max-w-sm rounded-lg shadow-lg"
          />
        </div>

        <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 shadow-lg text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white font-medium whitespace-nowrap">
                <span className="animate-pulse">{statusDownloads}</span> baixaram hoje
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium whitespace-nowrap">
                <span className="animate-pulse">{statusOnline}</span> online
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.formiga}
                onChange={() => toggleBump("formiga")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Últimas cópias disponíveis – garanta antes que saia do ar!
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(254,240,1,1)]">
                      Desenho Completo: A Formiga Atômica
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/formiga-atomica-4.jpg"
                    alt="A Formiga Atômica"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    A clássica <em>Formiga Atômica</em> voltou com todos os episódios dublados e remasterizados em alta
                    qualidade. Um verdadeiro tesouro da Hanna-Barbera reunido com carinho para quem cresceu assistindo e
                    quer reviver cada aventura.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.thundercats}
                onChange={() => toggleBump("thundercats")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Complete sua nostalgia com os guerreiros felinos mais lendários da TV!
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,238,0,1)]">
                      Desenho Completo: Thundercats
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/unnamed(1).jpg"
                    alt="Thundercats"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Adicione agora a coleção completa de <em>Thundercats</em> e reviva o grito que marcou gerações:
                    "Thunder... Thunder... Thundercats, ho!"
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.jetsons}
                onChange={() => toggleBump("jetsons")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Disponível por tempo limitado — coleção exclusiva dos Jetsons!
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,240,0,1)]">
                      Desenho Completo: Os Jetsons
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/MV5BN2NlYjMzYjItODNjYS00ZTEwLThmZmUtM2UwY2NkMzc2YjMxXkEyXkFqcGc%40._V1_FMjpg_UX1000_(1).jpg"
                    alt="Os Jetsons"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Todos os episódios de <em>Os Jetsons</em> reunidos em um só lugar, com qualidade impecável e
                    dublagem clássica. Uma verdadeira viagem no tempo que você não encontra em lugar nenhum.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.picapau}
                onChange={() => toggleBump("picapau")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Que tal levar o Pica-Pau mais engraçado da TV?
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(254,240,1,1)]">
                      Desenho Completo - Pica-Pau Coleção Clássica
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/c5b05d90d10be76ed2609e7046db7736(1).jpg"
                    alt="Pica-Pau"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                    <p>Você já sabe que não dá pra falar de infância sem lembrar da risada do Pica-Pau 🤪</p>
                    <p className="font-medium">E agora você pode levar TODAS as fases do personagem mais insano:</p>
                    <ul className="list-disc list-inside text-xs space-y-0.5 ml-2">
                      <li>Anos 40, 60, 90</li>
                      <li>Dublagem original</li>
                      <li>Episódios raros e especiais</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.caverna}
                onChange={() => toggleBump("caverna")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Reviva uma das histórias mais inesquecíveis da TV.
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,238,0,1)]">
                      Desenho Completo: A Caverna do Dragão
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/5951896(1).jpg"
                    alt="Caverna do Dragão"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Adicione <em>A Caverna do Dragão</em> e mergulhe de novo nesse mundo cheio de magia, aventura e
                    emoção.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.shera}
                onChange={() => toggleBump("shera")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Adicione She-Ra à sua coleção e reviva a força, coragem e magia da heroína que inspirou milhões nos
                    anos 80.
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,238,0,1)]">
                      Desenho Completo: She-ra
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/image-0(1).jpeg"
                    alt="She-Ra"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    A princesa do poder está de volta! Todos os episódios da série clássica de <em>She-Ra</em> reunidos
                    em um só lugar, com imagem e som remasterizados.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.luluzinha}
                onChange={() => toggleBump("luluzinha")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Adicione agora o Desenho Completo da Luluzinha
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,238,0,1)]">
                      Desenho Completo - Luluzinha
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/channels4_profile(1).jpg"
                    alt="Luluzinha"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                    <p>
                      Leve junto uma coleção especial com{" "}
                      <strong>episódios dublados raros, aberturas antigas e extras nunca exibidos na TV</strong>.
                    </p>
                    <p>Por apenas R$5,00 a mais, você garante um conteúdo exclusivo para completar sua coleção.</p>
                    <p className="text-yellow-300 italic text-xs">
                      Oferta válida apenas neste momento de compra. Após isso, não estará mais disponível.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/50 border-blue-600 text-white p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                checked={selectedBumps.tom}
                onChange={() => toggleBump("tom")}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-xs sm:text-sm font-medium mb-2 text-[rgba(255,255,255,1)]">
                    Leve junto a dupla mais engraçada dos desenhos animados!
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-sm sm:text-base text-[rgba(255,238,0,1)]">
                      Desenho Completo: As aventuras de Tom e Jerry
                    </h3>
                    <span className="font-bold text-white whitespace-nowrap text-sm sm:text-base">R$ 5,00</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/images/design-mode/Tom_and_Jerry.jpeg"
                    alt="Tom e Jerry"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Leve junto uma seleção extra com episódios raros, curtas clássicos e momentos especiais que marcaram
                    gerações.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-blue-900/50 border-blue-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium text-sm sm:text-base">PIX - Aprovação Imediata</span>
            </div>
            <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">SEGURO</Badge>
          </div>

          <div className="mb-4 p-3 bg-blue-800/30 rounded-lg">
            <div className="text-xs sm:text-sm text-gray-300 mb-2">Resumo do pedido:</div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="flex-1">Desenho Completo: A turma de Charlie Brown</span>
                <span className="font-semibold whitespace-nowrap">R$ 10,00</span>
              </div>
              {selectedBumps.formiga && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ A Formiga Atômica</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.thundercats && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Thundercats</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.jetsons && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Os Jetsons</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.picapau && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Pica-Pau Coleção</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.caverna && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Caverna do Dragão</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.shera && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ She-ra</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.luluzinha && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Luluzinha</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              {selectedBumps.tom && (
                <div className="flex items-center justify-between gap-2 text-blue-300">
                  <span className="flex-1">+ Tom e Jerry</span>
                  <span className="font-semibold whitespace-nowrap">R$ 5,00</span>
                </div>
              )}
              <div className="border-t border-slate-600 pt-2 flex items-center justify-between gap-2 font-bold text-sm sm:text-lg">
                <span>Total:</span>
                <span className="whitespace-nowrap">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">E-mail que deseja Receber o Acesso *</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-800/30 border-blue-600 text-white placeholder:text-slate-400 text-sm"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3 text-[rgba(255,255,255,1)]" />
              <span className="text-[rgba(255,255,255,1)]">Processo em 3 segundos</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 text-sm sm:text-lg transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gerando PIX...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  FINALIZAR PEDIDO - R$ {calculateTotal().toFixed(2)}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield className="w-3 h-3 text-[rgba(255,255,255,1)]" />
              <span className="text-center font-light text-[rgba(255,255,255,1)] leading-5">
                SSL Seguro • PIX Instantâneo • 100% Seguro
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-900/50 border-blue-600 text-white p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
            Depoimentos de quem já está assistindo👇🏻{" "}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-800/30 rounded-lg">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-xs sm:text-sm">{testimonial.name}</span>
                    <span className="text-xs text-gray-400">- {testimonial.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">{testimonial.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-blue-900/50 border-blue-600 text-white p-4 sm:p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-green-400">Garantia Incondicional de 7 Dias</h3>
            <p className="text-xs sm:text-sm mb-4 text-[rgba(255,255,255,1)]">
              Não gostou? Devolvemos 100% do seu dinheiro sem perguntas. Sua satisfação é nossa prioridade absoluta.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-green-400">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Reembolso garantido • Sem burocracia • Totalmente seguro</span>
            </div>
          </div>
        </Card>
      </div>

      {showPopup && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-lg animate-in slide-in-from-left-5 duration-500 z-50 max-w-[240px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{currentBuyer}</span>
          </div>
        </div>
      )}
    </div>
  )
}
