'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { Calendar } from '@/components/ui/calendar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { APPOINTMENTS, type AppointmentStatus } from '@/lib/appointments-data'

const statusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusVariant: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive'> = {
  scheduled: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const appointmentsForDay = useMemo(() => {
    if (!selectedDate) return APPOINTMENTS
    const target = selectedDate.toDateString()
    return APPOINTMENTS.filter((appt) => new Date(appt.date).toDateString() === target)
  }, [selectedDate])

  const counts = useMemo(
    () =>
      APPOINTMENTS.reduce(
        (acc, appt) => {
          acc[appt.status] += 1
          return acc
        },
        { scheduled: 0, completed: 0, cancelled: 0 } as Record<AppointmentStatus, number>,
      ),
    [],
  )

  const appointmentDates = useMemo(
    () => APPOINTMENTS.map((a) => new Date(a.date)),
    [],
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">MedEz dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View your upcoming and past appointments, then drill into prescriptions.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Scheduled
            </p>
            <p className="mt-2 text-2xl font-semibold">{counts.scheduled}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Completed
            </p>
            <p className="mt-2 text-2xl font-semibold">{counts.completed}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Cancelled
            </p>
            <p className="mt-2 text-2xl font-semibold">{counts.cancelled}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-medium">Appointments</h2>
              {selectedDate && (
                <p className="text-xs text-muted-foreground">
                  Showing appointments for{' '}
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsForDay.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="cursor-pointer"
                    onClick={() => (window.location.href = `/appointments/${appt.id}`)}
                  >
                    <TableCell className="font-medium">{appt.title}</TableCell>
                    <TableCell>{appt.doctorName}</TableCell>
                    <TableCell>
                      {new Date(appt.date).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={statusVariant[appt.status]}>
                        {statusLabel[appt.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Click an appointment row to view its prescription and medicines.
              </TableCaption>
            </Table>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-base font-medium">Calendar</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ booked: appointmentDates }}
              modifiersClassNames={{
                booked: 'bg-primary/20 text-primary-foreground',
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

