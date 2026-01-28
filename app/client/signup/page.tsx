import { AuthForm } from '@/components/client/AuthForm'

export default function ClientSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Get Started with Bawo
          </h1>
          <p className="text-gray-600">
            Create quality AI training data with African language experts
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
