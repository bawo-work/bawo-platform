import { ProjectForm } from '@/components/client/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Create Project</h1>
        <p className="text-gray-600 mt-2">
          Upload your data and configure your labeling project
        </p>
      </div>

      <ProjectForm />
    </div>
  )
}
