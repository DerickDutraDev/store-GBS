import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css"

import { Providers } from "@/components/Providers" 

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Store GBS - Camisas de Time Premium",
  description: "A melhor loja de camisas de time do Brasil. Qualidade premium, tecnologia e tradição.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <Providers>
            {children}
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
