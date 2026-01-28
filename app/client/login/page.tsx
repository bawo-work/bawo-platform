import { AuthForm } from '@/components/client/AuthForm'

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Bawo Client Portal
          </h1>
          <p className="text-gray-600">
            Manage your AI data labeling projects
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
