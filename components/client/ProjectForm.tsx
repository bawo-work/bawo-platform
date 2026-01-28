'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CSVUpload } from './CSVUpload'
import type { ParsedCSVData } from '@/lib/csv/parser'
import { extractTextData } from '@/lib/csv/parser'

const TASK_TYPES = {
  sentiment: {
    name: 'Sentiment Analysis',
    minPrice: 0.05,
    template: 'Classify the sentiment of the following text as Positive, Negative, or Neutral. Consider the overall tone and emotional content of the text.',
  },
  classification: {
    name: 'Text Classification',
    minPrice: 0.08,
    template: 'Classify the following text into one of these categories. Read carefully and select the most appropriate category based on the content.',
  },
}

const PLATFORM_FEE_RATE = 0.4 // 40%

export function ProjectForm() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [taskType, setTaskType] = useState<'sentiment' | 'classification'>('sentiment')
  const [instructions, setInstructions] = useState(TASK_TYPES.sentiment.template)
  const [pricePerTask, setPricePerTask] = useState(0.05)
  const [csvData, setCsvData] = useState<ParsedCSVData | null>(null)
  const [textColumn, setTextColumn] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTaskTypeChange = (type: 'sentiment' | 'classification') => {
    setTaskType(type)
    setInstructions(TASK_TYPES[type].template)
    setPricePerTask(TASK_TYPES[type].minPrice)
  }

  const handleCSVParsed = (data: ParsedCSVData, column: string) => {
    setCsvData(data)
    setTextColumn(column)
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    if (!csvData || !textColumn) {
      setError('Please upload a CSV file')
      return
    }

    if (pricePerTask < TASK_TYPES[taskType].minPrice) {
      setError(`Minimum price for ${taskType} is $${TASK_TYPES[taskType].minPrice}`)
      return
    }

    setLoading(true)

    try {
      // Extract text data from CSV
      const texts = extractTextData(csvData.data, textColumn)

      if (texts.length === 0) {
        throw new Error('No valid text data found in selected column')
      }

      // Create project
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          taskType,
          instructions,
          pricePerTask,
          csvData: texts,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create project')
      }

      // Redirect to project detail page
      router.push(`/client/projects/${result.projectId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  // Calculate costs
  const taskCount = csvData?.rowCount || 0
  const subtotal = taskCount * pricePerTask
  const platformFee = subtotal * PLATFORM_FEE_RATE
  const workerPayment = subtotal - platformFee
  const totalCost = subtotal

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          type="text"
          placeholder="Customer Sentiment Analysis"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {/* Task Type */}
      <div className="space-y-2">
        <Label>Task Type</Label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(TASK_TYPES).map(([key, type]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTaskTypeChange(key as 'sentiment' | 'classification')}
              disabled={loading}
              className={`
                px-4 py-3 text-sm font-medium rounded-md border-2 transition-colors
                ${taskType === key
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div>{type.name}</div>
              <div className="text-xs text-gray-500 mt-1">Min ${type.minPrice}/task</div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions">Task Instructions</Label>
        <textarea
          id="instructions"
          rows={4}
          placeholder="Provide clear instructions for workers..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          disabled={loading}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-gray-500">
          Clear instructions lead to better quality results
        </p>
      </div>

      {/* Price Per Task */}
      <div className="space-y-2">
        <Label htmlFor="pricePerTask">Price Per Task (USD)</Label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">$</span>
          <Input
            id="pricePerTask"
            type="number"
            step="0.01"
            min={TASK_TYPES[taskType].minPrice}
            value={pricePerTask}
            onChange={(e) => setPricePerTask(parseFloat(e.target.value))}
            disabled={loading}
            required
            className="flex-1"
          />
        </div>
        <p className="text-xs text-gray-500">
          Minimum: ${TASK_TYPES[taskType].minPrice}
        </p>
      </div>

      {/* CSV Upload */}
      <CSVUpload
        onDataParsed={handleCSVParsed}
        onError={(err) => setError(err)}
      />

      {/* Price Calculator */}
      {csvData && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tasks</span>
                <span className="font-medium">{taskCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per task</span>
                <span className="font-medium">${pricePerTask.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Platform fee (40%)</span>
                <span className="text-gray-500">${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Worker payment (60%)</span>
                <span className="text-gray-500">${workerPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Cost</span>
                <span className="font-semibold text-gray-900">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !csvData}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {loading ? 'Creating...' : 'Launch Project'}
        </Button>
      </div>
    </form>
  )
}
