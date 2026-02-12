import Link from 'next/link'

import { APPOINTMENTS } from '@/lib/appointments-data'

type Props = {
  params: { id: string }
}

export default function AppointmentDetailPage({ params }: Props) {
  const appointment = APPOINTMENTS.find((a) => a.id === params.id)

  if (!appointment) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
          <h1 className="text-2xl font-semibold">Appointment not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find the appointment you were looking for.
          </p>
          <Link href="/dashboard" className="mt-4 text-sm text-primary underline">
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Prescription for {appointment.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
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
          <Link href="/dashboard" className="text-sm text-primary underline">
            Back to dashboard
          </Link>
        </header>

        <section className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-base font-medium">Prescription file</h2>
          <p className="text-sm text-muted-foreground">
            For demo purposes, this links to a placeholder PDF. Replace with your real
            prescription file viewer or download link.
          </p>
          <a
            href="https://www.who.int/docs/default-source/medicines/npscorecard-template.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm text-primary underline"
          >
            View prescription PDF
          </a>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-base font-medium">Medicines</h2>
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
                  className="text-primary underline"
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

