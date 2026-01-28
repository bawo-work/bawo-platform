import Papa from 'papaparse'

export interface ParsedCSVData {
  data: Record<string, any>[]
  columns: string[]
  rowCount: number
}

export interface ValidationError {
  type: 'file_size' | 'row_count' | 'format' | 'empty' | 'columns'
  message: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_ROWS = 10000

/**
 * Validate CSV file before parsing
 */
export function validateCSVFile(file: File): ValidationError | null {
  // Check file extension
  if (!file.name.endsWith('.csv')) {
    return {
      type: 'format',
      message: 'File must be a CSV (.csv extension)',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: 'file_size',
      message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      type: 'empty',
      message: 'File is empty',
    }
  }

  return null
}

/**
 * Parse CSV file and return structured data
 */
export async function parseCSVFile(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        const data = results.data as Record<string, any>[]

        // Check if we have data
        if (data.length === 0) {
          reject(new Error('CSV file is empty or has no valid rows'))
          return
        }

        // Check row count
        if (data.length > MAX_ROWS) {
          reject(new Error(`CSV has too many rows. Maximum is ${MAX_ROWS}, got ${data.length}`))
          return
        }

        // Get columns from first row
        const columns = Object.keys(data[0])

        if (columns.length === 0) {
          reject(new Error('CSV has no columns'))
          return
        }

        resolve({
          data,
          columns,
          rowCount: data.length,
        })
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      },
    })
  })
}

/**
 * Find suitable text column from CSV data
 * Looks for common column names like 'text', 'content', 'message', etc.
 */
export function findTextColumn(columns: string[]): string | null {
  const commonTextColumns = ['text', 'content', 'message', 'comment', 'review', 'description']

  // Try exact matches first (case-insensitive)
  for (const col of commonTextColumns) {
    const match = columns.find(c => c.toLowerCase() === col)
    if (match) return match
  }

  // Try partial matches
  for (const col of commonTextColumns) {
    const match = columns.find(c => c.toLowerCase().includes(col))
    if (match) return match
  }

  // If no match, return first column
  return columns[0] || null
}

/**
 * Validate that selected column has text data
 */
export function validateTextColumn(
  data: Record<string, any>[],
  columnName: string
): { valid: boolean; error?: string } {
  if (!columnName) {
    return { valid: false, error: 'No column selected' }
  }

  // Check if column exists
  if (!data[0] || !(columnName in data[0])) {
    return { valid: false, error: `Column "${columnName}" not found in data` }
  }

  // Check if column has any non-empty values
  const hasValues = data.some(row => {
    const value = row[columnName]
    return value && String(value).trim().length > 0
  })

  if (!hasValues) {
    return { valid: false, error: `Column "${columnName}" has no text data` }
  }

  return { valid: true }
}

/**
 * Extract text data from parsed CSV
 */
export function extractTextData(
  data: Record<string, any>[],
  textColumn: string
): string[] {
  return data
    .map(row => String(row[textColumn] || '').trim())
    .filter(text => text.length > 0)
}
