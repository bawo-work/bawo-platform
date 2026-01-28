'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectProgress } from '@/components/client/ProjectProgress'
import { useProjectProgress } from '@/hooks/useProjectProgress'
import { Download, AlertCircle } from 'lucide-react'

interface Project {
  id: string
  name: string
  task_type: string
  instructions: string
  price_per_task: number
  total_tasks: number
  completed_tasks: number
  status: string
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { stats, loading: statsLoading } = useProjectProgress(projectId)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/v1/projects/${projectId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch project')
        }

        setProject(data.project)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleDownloadResults = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/v1/projects/${projectId}/results`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to download results')
      }

      // Download CSV file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.name.replace(/\s+/g, '-')}-results-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download results')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error || 'Project not found'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isComplete = stats.percentComplete === 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{project.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="capitalize">{project.task_type}</span>
            <span>•</span>
            <span className="capitalize">{project.status}</span>
            <span>•</span>
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {isComplete && (
          <Button
            onClick={handleDownloadResults}
            disabled={downloading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download Results'}
          </Button>
        )}
      </div>

      {/* Progress */}
      <ProjectProgress stats={stats} loading={statsLoading} />

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Task Type</label>
            <p className="text-gray-900 mt-1 capitalize">{project.task_type}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Instructions</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{project.instructions}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price per Task</label>
              <p className="text-gray-900 mt-1">${project.price_per_task.toFixed(2)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Total Cost</label>
              <p className="text-gray-900 mt-1">
                ${(project.total_tasks * project.price_per_task).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Available Message */}
      {isComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Download className="w-5 h-5 text-green-700" />
            <div>
              <p className="text-sm font-medium text-green-900">Results ready for download</p>
              <p className="text-xs text-green-700">All tasks have been completed</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
