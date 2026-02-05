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
  metadataBase: new URL("https://bawo-work.vercel.app"),
  title: {
    default: "Bawo – Fair pay for AI data labeling",
    template: "%s | Bawo",
  },
  description: "Earn $3-6/hr labeling AI training data in Swahili, English & Sheng. Instant payment via MiniPay. No minimums, no delays. Join the beta in Kenya.",
  keywords: [
    "AI data labeling",
    "data annotation jobs Kenya",
    "earn money online Kenya",
    "Swahili AI training data",
    "MiniPay jobs",
    "Celo stablecoin payments",
    "Remotasks alternative",
    "fair pay AI workers",
    "African language AI",
    "text classification jobs",
    "gig work Kenya",
    "instant payment platform",
    "data labeling platform Africa",
    "Sheng NLP data",
    "sentiment analysis jobs",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/bawo-logo.png",
    apple: "/bawo-logo.png",
    shortcut: "/bawo-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bawo-work.vercel.app",
    siteName: "Bawo",
    title: "Bawo – Fair pay for AI data labeling | Earn $3-6/hr",
    description: "Label AI training data in Swahili, English & Sheng. Earn $3-6/hr with instant payment to MiniPay. No minimums, no delays. Join the beta.",
    images: [
      {
        url: "/bawo-logo.png",
        width: 512,
        height: 512,
        alt: "Bawo – Fair pay for AI data labeling",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@BawoWork",
    creator: "@BawoWork",
    title: "Bawo – Fair pay for AI data labeling | Earn $3-6/hr",
    description: "Label AI training data in Swahili & English. Instant payment via MiniPay. $3-6/hr, no minimums. Join the beta in Kenya.",
    images: ["/bawo-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bawo-work.vercel.app",
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
