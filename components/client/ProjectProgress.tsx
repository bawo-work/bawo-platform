'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'

interface ProjectProgressProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    pending: number
    percentComplete: number
  }
  loading?: boolean
}

export function ProjectProgress({ stats, loading }: ProjectProgressProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="font-semibold text-teal-700">
              {stats.percentComplete.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentComplete}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{stats.completed}</div>
            <div className="text-xs text-green-700">Completed</div>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Loader2 className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-900">{stats.inProgress}</div>
            <div className="text-xs text-yellow-700">In Progress</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-xs text-gray-700">Pending</div>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tasks</span>
            <span className="font-semibold text-gray-900">{stats.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
