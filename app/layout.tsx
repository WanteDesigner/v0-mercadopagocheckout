import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "MangaFlix - Pack Premium",
  description: "Acesso a +5.000 mangás em português",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '715632621530184');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=715632621530184&ev=PageView&noscript=1"
          />
        </noscript>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('D4B27KBC77UF4SPAH9HG');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Captura parâmetros da URL (fbclid, fbp, fbc)
              const urlParams = new URLSearchParams(window.location.search);
              const fbpParam = urlParams.get('fbp');
              const fbcParam = urlParams.get('fbc');
              const fbclid = urlParams.get('fbclid');

              // Função pra salvar cookie
              function setCookie(name, value) {
                if (value) {
                  document.cookie = name + '=' + value + '; path=/; max-age=63072000; SameSite=None; Secure';
                }
              }

              // Se vierem parâmetros da Cakto, grava no domínio do checkout
              if (fbpParam) setCookie('_fbp', fbpParam);
              if (fbcParam) setCookie('_fbc', fbcParam);

              // Se tiver fbclid mas não fbc, gera o _fbc a partir dele
              if (fbclid && !fbcParam) {
                const fbcValue = 'fb.1.' + Date.now() + '.' + fbclid;
                setCookie('_fbc', fbcValue);
              }
            `,
          }}
        />

        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
}
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
