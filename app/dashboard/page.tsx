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
import { LayoutDashboard, CalendarDays, CalendarCheck, XCircle, Plus } from 'lucide-react'
import { DepartmentsPanel } from '@/components/DepartmentsPanel'
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
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-800">MedEz dashboard</h1>
              <p className="mt-1 text-sm text-slate-600">
                View your upcoming and past appointments, then drill into prescriptions.
              </p>
            </div>
          </div>
          <Link
            href="/appointments/create"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Create appointment
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border-2 border-sky-200 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-sky-600" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Scheduled
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-800">{counts.scheduled}</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-200 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Completed
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-800">{counts.completed}</p>
          </div>
          <div className="rounded-xl border-2 border-rose-200 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Cancelled
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-800">{counts.cancelled}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
          <div className="rounded-xl border-2 border-sky-200 bg-white p-5 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-600" />
                <h2 className="text-base font-semibold text-slate-800">Appointments</h2>
              </div>
              {selectedDate && (
                <p className="text-xs text-slate-600">
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

          <div className="rounded-xl border-2 border-sky-200 bg-white p-5 shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-sky-600" />
              <h2 className="text-base font-semibold text-slate-800">Calendar</h2>
            </div>
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

        <DepartmentsPanel />
      </div>
    </main>
  )
}

