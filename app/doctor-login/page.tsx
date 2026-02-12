'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Stethoscope, UserCircle } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabaseClient'

export default function DoctorLoginPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseClient()

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Optional: create a dummy appointment for verification
    try {
      if (data.session?.user.id) {
        await supabase.from('appointments').insert({
          patient_id: data.session.user.id,
          doctor_id: data.session.user.id,
          title: 'Demo appointment (doctor)',
          description: 'Automatically created to verify Supabase connectivity.',
          scheduled_at: new Date().toISOString(),
        })
      }
    } catch {
      // Ignore demo insert failures
    }

    router.push('/dashboard')

    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'doctor',
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Optional: create a dummy appointment for verification
    try {
      if (data.session?.user.id) {
        await supabase.from('appointments').insert({
          patient_id: data.session.user.id,
          doctor_id: data.session.user.id,
          title: 'Demo appointment (doctor)',
          description: 'Automatically created to verify Supabase connectivity.',
          scheduled_at: new Date().toISOString(),
        })
      }
    } catch {
      // Ignore demo insert failures
    }

    router.push('/dashboard')

    setLoading(false)
  }

  const handleSignOut = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="card-elevated w-full max-w-md space-y-4 rounded-xl border border-teal-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <UserCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Doctor portal</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as: {session.user.email}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="btn-vanilla mt-4 inline-flex items-center justify-center rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            Sign out
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="card-elevated w-full max-w-md space-y-6 rounded-xl border border-teal-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-slate-800">Doctor login</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              type="email"
              className="input-vanilla w-full rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-vanilla w-full rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-vanilla w-full rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:opacity-50 disabled:hover:transform-none"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
            className="btn-vanilla w-full rounded-lg border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-50 disabled:hover:transform-none"
        >
          {loading ? 'Creating doctor account...' : 'Sign up as doctor'}
        </button>
      </div>
    </main>
  )
}

