'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentClient } from '@/lib/auth/client'

export default function SettingsPage() {
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClient() {
      try {
        const data = await getCurrentClient()
        setClient(data)
      } catch (error) {
        console.error('Failed to fetch client:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <p className="text-gray-900 mt-1">{client?.company_name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900 mt-1">{client?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Account Created</label>
            <p className="text-gray-900 mt-1">
              {client?.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">API keys coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
