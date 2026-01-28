'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderKanban, CheckCircle2, Clock, DollarSign, Plus } from 'lucide-react'
import { getCurrentClient } from '@/lib/auth/client'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  totalSpent: number
}

export default function ClientDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        const client = await getCurrentClient()
        if (!client) return

        setCompanyName(client.company_name || 'Client')

        // Fetch project stats
        const { data: projects } = await supabase
          .from('projects')
          .select('id, total_tasks, completed_tasks, price_per_task')
          .eq('client_id', client.id)

        if (projects) {
          const totalProjects = projects.length
          const activeTasks = projects.reduce((sum, p) => sum + (p.total_tasks - p.completed_tasks), 0)
          const completedTasks = projects.reduce((sum, p) => sum + p.completed_tasks, 0)
          const totalSpent = projects.reduce(
            (sum, p) => sum + (p.completed_tasks * p.price_per_task),
            0
          )

          setStats({
            totalProjects,
            activeTasks,
            completedTasks,
            totalSpent,
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {companyName}</p>
        </div>
        <Link href="/client/projects/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Projects
              </CardTitle>
              <FolderKanban className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Tasks
              </CardTitle>
              <Clock className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed Tasks
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.completedTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Spent
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.totalSpent.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/client/projects/new">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </Link>
          <Link href="/client/projects">
            <Button variant="outline" className="w-full justify-start">
              <FolderKanban className="w-4 h-4 mr-2" />
              View All Projects
            </Button>
          </Link>
          <Link href="/client/deposit">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!loading && stats.totalProjects === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Create your first data labeling project to get started with quality AI training data.
            </p>
            <Link href="/client/projects/new">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
