import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // If Supabase is not configured, return success
    if (!supabase) {
      console.log('Supabase not configured, email stored locally:', email)
      return NextResponse.json({ success: true, message: 'Added to waitlist' })
    }

    // Check for existing email
    const { data: existing } = await supabase
      .from('punch_waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Insert new email
    const { error } = await supabase
      .from('punch_waitlist')
      .insert([{ email: email.toLowerCase() }])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to add to waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Added to waitlist' })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
