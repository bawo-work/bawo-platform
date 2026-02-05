'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, QrCode, CreditCard } from 'lucide-react'
import { getCurrentClient } from '@/lib/auth/client'
import { QRCodeSVG } from 'qrcode.react'

const DEPOSIT_ADDRESS = process.env.NEXT_PUBLIC_CLIENT_DEPOSIT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

export default function DepositPage() {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBalance() {
      try {
        const client = await getCurrentClient()
        if (client) {
          setBalance(client.balance_usd)
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Deposit Funds</h1>
        <p className="text-gray-600 mt-2">Add cUSD to your account balance</p>
      </div>

      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">
              ${balance.toFixed(2)} cUSD
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Crypto Deposit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Crypto Deposit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Send cUSD (Celo Dollar) to this address
            </p>

            {/* QR Code */}
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <QRCodeSVG value={DEPOSIT_ADDRESS} size={200} />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Deposit Address</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={DEPOSIT_ADDRESS}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(DEPOSIT_ADDRESS)}
                  className="px-3 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Only send cUSD on Celo network</p>
              <p>• Deposits confirmed after 1 block (~5 seconds)</p>
              <p>• Minimum deposit: $1.00</p>
            </div>
          </CardContent>
        </Card>

        {/* Card Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Buy cUSD instantly with your debit or credit card
            </p>

            <a
              href="https://www.moonpay.com/buy/cusd"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-center bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Buy cUSD with Card →
            </a>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Powered by MoonPay</p>
              <p>• 3-5% card processing fee</p>
              <p>• Instant delivery to your wallet</p>
              <p>• KYC verification required</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 text-center py-8">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
