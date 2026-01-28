'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProjectStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  percentComplete: number
}

export function useProjectProgress(projectId: string) {
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    percentComplete: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial stats
    async function fetchStats() {
      try {
        const { data: project } = await supabase
          .from('projects')
          .select('total_tasks, completed_tasks')
          .eq('id', projectId)
          .single()

        if (project) {
          const { data: tasks } = await supabase
            .from('tasks')
            .select('status')
            .eq('project_id', projectId)

          const statusCount = {
            pending: 0,
            assigned: 0,
            completed: 0,
          }

          tasks?.forEach((task) => {
            if (task.status in statusCount) {
              statusCount[task.status as keyof typeof statusCount]++
            }
          })

          setStats({
            total: project.total_tasks,
            completed: project.completed_tasks,
            inProgress: statusCount.assigned,
            pending: statusCount.pending,
            percentComplete: (project.completed_tasks / project.total_tasks) * 100,
          })
        }
      } catch (error) {
        console.error('Failed to fetch project stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Subscribe to project updates via Supabase Realtime
    const channel = supabase
      .channel(`project:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          const updated = payload.new as any
          setStats((prev) => ({
            ...prev,
            completed: updated.completed_tasks,
            percentComplete: (updated.completed_tasks / updated.total_tasks) * 100,
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  return { stats, loading }
}
