'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Client-side validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (mode === 'signup' && !companyName) {
        throw new Error('Company name is required')
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      const endpoint = `/api/v1/auth/client/${mode === 'login' ? 'login' : 'signup'}`
      const body = mode === 'signup'
        ? { email, password, companyName }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `${mode === 'login' ? 'Login' : 'Signup'} failed`)
      }

      // Redirect to dashboard on success
      router.push('/client/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Log In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Access your client dashboard'
            : 'Start creating AI labeling projects'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Acme AI Labs"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={8}
            />
            {mode === 'signup' && (
              <p className="text-sm text-muted-foreground">
                Minimum 8 characters
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <a href="/client/signup" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <a href="/client/login" className="text-primary hover:underline">
                  Log in
                </a>
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
