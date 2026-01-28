'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { parseCSVFile, validateCSVFile, findTextColumn, type ParsedCSVData } from '@/lib/csv/parser'

interface CSVUploadProps {
  onDataParsed: (data: ParsedCSVData, textColumn: string) => void
  onError?: (error: string) => void
}

export function CSVUpload({ onDataParsed, onError }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string>('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const uploadedFile = acceptedFiles[0]
    setError(null)
    setFile(uploadedFile)
    setParsing(true)

    try {
      // Validate file
      const validationError = validateCSVFile(uploadedFile)
      if (validationError) {
        throw new Error(validationError.message)
      }

      // Parse CSV
      const parsed = await parseCSVFile(uploadedFile)
      setParsedData(parsed)

      // Auto-detect text column
      const textCol = findTextColumn(parsed.columns)
      if (textCol) {
        setSelectedColumn(textCol)
        onDataParsed(parsed, textCol)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse CSV'
      setError(message)
      if (onError) onError(message)
      setFile(null)
      setParsedData(null)
    } finally {
      setParsing(false)
    }
  }, [onDataParsed, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleRemove = () => {
    setFile(null)
    setParsedData(null)
    setSelectedColumn('')
    setError(null)
  }

  const handleColumnChange = (column: string) => {
    setSelectedColumn(column)
    if (parsedData) {
      onDataParsed(parsedData, column)
    }
  }

  return (
    <div className="space-y-4">
      <Label>Upload CSV File</Label>

      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-gray-400'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-teal-600' : 'text-gray-400'}`} />
          {parsing ? (
            <p className="text-sm text-gray-600">Parsing CSV...</p>
          ) : (
            <>
              <p className="text-sm text-gray-900 font-medium mb-2">
                {isDragActive ? 'Drop CSV file here' : 'Drag & drop CSV file here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                Max file size: 50MB | Max rows: 10,000
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          {/* File Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {parsedData ? `${parsedData.rowCount} rows, ${parsedData.columns.length} columns` : 'Processing...'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Column Selector */}
          {parsedData && (
            <div className="space-y-2">
              <Label htmlFor="textColumn" className="text-sm">Select Text Column</Label>
              <select
                id="textColumn"
                value={selectedColumn}
                onChange={(e) => handleColumnChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Select column --</option>
                {parsedData.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preview */}
          {parsedData && selectedColumn && (
            <div className="space-y-2">
              <Label className="text-sm">Preview (First 5 rows)</Label>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">{selectedColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-2 text-gray-900 truncate max-w-md">
                          {String(row[selectedColumn] || '').slice(0, 100)}
                          {String(row[selectedColumn] || '').length > 100 ? '...' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success Message */}
          {parsedData && selectedColumn && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>CSV parsed successfully: {parsedData.rowCount} tasks ready</span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
