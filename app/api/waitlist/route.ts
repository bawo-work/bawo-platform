import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
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

    const supabase = getSupabase()

    const { error } = await supabase.from('waitlist').insert({
      email: email.toLowerCase().trim(),
      type,
      source: req.headers.get('referer') || 'direct',
    })

    if (error) {
      // Unique constraint = already signed up
      if (error.code === '23505') {
        return NextResponse.json({ message: "You're already on the list!" })
      }
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }

    return NextResponse.json({ message: "You're in! We'll be in touch soon." })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    return NextResponse.json({ count: count || 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
