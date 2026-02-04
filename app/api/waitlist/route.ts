import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

async function ensureFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, '[]')
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!type || !['worker', 'company'].includes(type)) {
      return NextResponse.json({ error: 'Type must be worker or company' }, { status: 400 })
    }

    await ensureFile()
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'))

    // Check for duplicate
    if (data.some((entry: any) => entry.email === email)) {
      return NextResponse.json({ message: "You're already on the list!" })
    }

    data.push({
      email,
      type,
      timestamp: new Date().toISOString(),
      source: req.headers.get('referer') || 'direct',
    })

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ message: "You're in! We'll be in touch soon." })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureFile()
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'))
    return NextResponse.json({ count: data.length })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
