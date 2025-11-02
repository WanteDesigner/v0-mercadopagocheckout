import { Suspense } from "react"
import PaymentPage from "@/components/payment-page"

function PaymentPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-lg">Carregando pagamento...</div>
        </div>
      }
    >
      <PaymentPage />
    </Suspense>
  )
}

export default function Payment() {
  return <PaymentPageWrapper />
}
