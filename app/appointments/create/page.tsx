'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarPlus, ArrowLeft } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { AVAILABLE_DOCTORS } from '@/lib/doctors-data'

export default function CreateAppointmentPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null))
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      setError('Please log in to create an appointment.')
      router.push('/login')
      return
    }
    if (!title.trim() || !doctorId || !date || !time) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    const selectedDoctor = AVAILABLE_DOCTORS.find((d) => d.id === doctorId)
    const scheduledAt = new Date(`${date}T${time}`).toISOString()
    const desc = description.trim()
      ? `${description}\n\nRequested doctor: ${selectedDoctor?.name ?? doctorId}`
      : `Requested doctor: ${selectedDoctor?.name ?? doctorId}`

    const supabase = createSupabaseClient()
    const { error: insertError } = await supabase.from('appointments').insert({
      patient_id: session.user.id,
      doctor_id: session.user.id, // Use patient id for demo; add doctor profiles for real doctor selection
      title: title.trim(),
      description: desc,
      scheduled_at: scheduledAt,
      status: 'scheduled',
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  if (!session) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-white">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-slate-600">Please log in to create an appointment.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-6 py-10">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="rounded-xl border-2 border-sky-200 bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <CalendarPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Create appointment</h1>
              <p className="text-sm text-slate-600">Book a consultation with an available doctor</p>
            </div>
          </div>

          {success ? (
            <div className="rounded-lg bg-emerald-50 p-4 text-center text-emerald-700">
              Appointment created successfully. Redirecting to dashboard...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
              )}

              <div>
                <label htmlFor="doctor" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Doctor *
                </label>
                <select
                  id="doctor"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full rounded-lg border border-sky-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">Select a doctor</option>
                  {AVAILABLE_DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Appointment title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Follow-up consultation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-sky-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-sky-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Time *
                  </label>
                  <input
                    id="time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-sky-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Brief reason for the appointment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-sky-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create appointment'}
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-sky-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-sky-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
