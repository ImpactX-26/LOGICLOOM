import { createClient } from '@supabase/supabase-js'
import { U } from './data.js'

// Check environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

export const hasSupabase = !!(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project'))
export const hasGoogleOAuth = !!(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('your-google'))
export const hasGithubOAuth = !!(GITHUB_CLIENT_ID && !GITHUB_CLIENT_ID.includes('your-github'))

export let supabase = null
if (hasSupabase) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  } catch (err) {
    console.warn('[VOLCANO ZERO] Supabase init error:', err)
  }
}

// Local storage session key
const SESSION_KEY = 'volcano_zero_session'

// Load existing session on boot
export function getSavedSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.email) {
        U.name = parsed.name || parsed.email.split('@')[0]
        U.email = parsed.email
        return parsed
      }
    }
  } catch (e) {
    console.error('Session load error', e)
  }
  return null
}

export function saveSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    U.name = user.name || user.email.split('@')[0]
    U.email = user.email
  } catch (e) {
    console.error('Session save error', e)
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
    U.name = 'Duty Scientist'
    U.email = 'operator@volcanozero.ai'
    if (supabase) {
      supabase.auth.signOut().catch(() => {})
    }
  } catch (e) {
    console.error('Session clear error', e)
  }
}

// Initialize and handle OAuth redirect from Supabase or external provider
export async function initAuth() {
  // Check Supabase session first
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user) {
      const u = data.session.user
      const profile = {
        id: u.id,
        email: u.email,
        name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
        avatar_url: u.user_metadata?.avatar_url || ''
      }
      saveSession(profile)
      return profile
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = session.user
        saveSession({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0]
        })
      } else if (event === 'SIGNED_OUT') {
        clearSession()
      }
    })
  }

  return getSavedSession()
}

// Real OAuth Sign-In trigger for Google & GitHub
export async function triggerOAuth(provider) {
  if (supabase) {
    const redirectTo = window.location.origin + window.location.pathname + '#/app/dash'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider, // 'google' | 'github'
      options: { redirectTo }
    })
    if (error) throw error
    return { status: 'redirecting' }
  }

  // If specific OAuth client ID is configured for direct client OAuth flow:
  if (provider === 'google' && hasGoogleOAuth) {
    const root = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: 'token',
      scope: 'email profile',
      include_granted_scopes: 'true',
      state: 'vz_oauth_google'
    })
    window.location.href = `${root}?${params.toString()}`
    return { status: 'redirecting' }
  }

  if (provider === 'github' && hasGithubOAuth) {
    const root = 'https://github.com/login/oauth/authorize'
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: window.location.origin + window.location.pathname,
      scope: 'read:user user:email',
      state: 'vz_oauth_github'
    })
    window.location.href = `${root}?${params.toString()}`
    return { status: 'redirecting' }
  }

  // If OAuth keys are not yet defined in .env, throw descriptive informative error
  throw new Error(`OAuth credentials for ${provider.toUpperCase()} are not yet configured in .env. Please set VITE_SUPABASE_URL or VITE_${provider.toUpperCase()}_CLIENT_ID as documented in .env.example.`)
}

// Email/Password Sign-In
export async function signInEmail(email, password) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const u = data.user
    const prof = {
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name || email.split('@')[0]
    }
    saveSession(prof)
    return prof
  }

  // Local verified prototype storage
  const prof = {
    email,
    name: email.split('@')[0],
    role: 'Duty Scientist'
  }
  saveSession(prof)
  return prof
}

// Email/Password Sign-Up
export async function signUpEmail(name, email, password) {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) throw error
    const u = data.user
    const prof = {
      id: u?.id || 'local-user',
      email: email,
      name: name
    }
    saveSession(prof)
    return prof
  }

  const prof = {
    email,
    name: name || email.split('@')[0],
    role: 'Duty Scientist'
  }
  saveSession(prof)
  return prof
}
