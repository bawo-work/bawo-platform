import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Bawo – Fair pay for AI data labeling",
  description: "Label AI training data in your native language. Fair rates. Instant payment to your wallet. No delays, no minimums.",
  manifest: "/manifest.json",
  icons: {
    icon: "/bawo-logo.png",
    apple: "/bawo-logo.png",
    shortcut: "/bawo-logo.png",
  },
  openGraph: {
    title: "Bawo – Fair pay for AI data labeling",
    description: "Label AI training data in your native language. Fair rates. Instant payment to your wallet.",
    images: ["/bawo-logo.png"],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A5F5A",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased bg-warm-white text-warm-gray-800">
        {children}
      </body>
    </html>
  )
}
