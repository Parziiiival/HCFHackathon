import Link from 'next/link'
import { FileText, Pill } from 'lucide-react'

import { APPOINTMENTS } from '@/lib/appointments-data'

type Props = {
  params: { id: string }
}

export default function AppointmentDetailPage({ params }: Props) {
  const appointment = APPOINTMENTS.find((a) => a.id === params.id)

  if (!appointment) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50/50 to-cyan-50/30">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-semibold">Appointment not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find the appointment you were looking for.
          </p>
          <Link
            href="/dashboard"
            className="btn-vanilla mt-6 inline-flex items-center rounded-lg border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  const medicines = [
    {
      name: 'Paracetamol 500mg',
      url: 'https://pharmeasy.in/online-medicine-order/paracetamol-500',
    },
    {
      name: 'Ibuprofen 400mg',
      url: 'https://pharmeasy.in/online-medicine-order/ibuprofen-400',
    },
    {
      name: 'Vitamin D3 supplement',
      url: 'https://pharmeasy.in/online-medicine-order/vitamin-d3',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-background to-cyan-50/30">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                Prescription for {appointment.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
              {new Date(appointment.date).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              · {appointment.doctorName}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700 shadow-sm transition-colors hover:bg-sky-50"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="card-elevated space-y-3 rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sky-500" />
            <h2 className="text-base font-semibold text-slate-800">Prescription file</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            For demo purposes, this links to a placeholder PDF. Replace with your real
            prescription file viewer or download link.
          </p>
          <a
            href="https://www.who.int/docs/default-source/medicines/npscorecard-template.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-vanilla inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
          >
            View prescription PDF
          </a>
        </section>

        <section className="card-elevated space-y-3 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-semibold text-slate-800">Medicines</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Suggested medicines for this appointment. Each item links out to example
            medicine information.
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            {medicines.map((med) => (
              <li key={med.name} className="flex items-center justify-between gap-4">
                <span>{med.name}</span>
                <a
                  href={med.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View details
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

