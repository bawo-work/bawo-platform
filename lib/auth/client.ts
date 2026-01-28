/**
 * Client Authentication Utilities
 * Handles email/password authentication for AI company clients
 */

import { supabase, createServerClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface SignUpClientData {
  email: string
  password: string
  companyName: string
}

export interface SignUpClientResult {
  user: User
  session: Session
  clientId: string
}

export interface SignInClientResult {
  user: User
  session: Session
}

/**
 * Create a new client account
 * Creates both Supabase Auth user and clients table record
 */
export async function signUpClient(
  data: SignUpClientData
): Promise<SignUpClientResult> {
  const { email, password, companyName } = data

  // Validate inputs
  if (!email || !password || !companyName) {
    throw new Error('Email, password, and company name are required')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
        user_type: 'client',
      },
    },
  })

  if (authError) {
    throw new Error(`Signup failed: ${authError.message}`)
  }

  if (!authData.user || !authData.session) {
    throw new Error('Signup failed: No user or session returned')
  }

  // Create client record in database
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .insert({
      auth_user_id: authData.user.id,
      email,
      company_name: companyName,
      balance_usd: 0,
    })
    .select()
    .single()

  if (clientError) {
    // Rollback: delete auth user if client creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error(`Failed to create client record: ${clientError.message}`)
  }

  return {
    user: authData.user,
    session: authData.session,
    clientId: clientData.id,
  }
}

/**
 * Sign in an existing client
 */
export async function signInClient(
  email: string,
  password: string
): Promise<SignInClientResult> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Login failed: ${error.message}`)
  }

  if (!data.user || !data.session) {
    throw new Error('Login failed: No user or session returned')
  }

  // Verify this is a client account
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('auth_user_id', data.user.id)
    .single()

  if (clientError || !clientData) {
    throw new Error('Not a valid client account')
  }

  return {
    user: data.user,
    session: data.session,
  }
}

/**
 * Sign out the current client
 */
export async function signOutClient(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(`Logout failed: ${error.message}`)
  }
}

/**
 * Get the current client session
 */
export async function getClientSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Session error:', error)
    return null
  }

  return data.session
}

/**
 * Get the current client's database record
 */
export async function getCurrentClient() {
  const session = await getClientSession()
  if (!session) {
    return null
  }

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  if (error) {
    console.error('Failed to fetch client:', error)
    return null
  }

  return data
}

/**
 * Server-side: Get client from auth user ID
 */
export async function getClientByAuthUserId(authUserId: string) {
  const serverClient = createServerClient()

  const { data, error } = await serverClient
    .from('clients')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch client: ${error.message}`)
  }

  return data
}
