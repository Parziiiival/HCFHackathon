"use client"

import { useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AppointmentList } from "@/components/dashboard/appointment-list"
import { AppointmentDetail } from "@/components/dashboard/appointment-detail"
import { CalendarSidebar } from "@/components/dashboard/calendar-sidebar"
import { NewAppointmentDialog } from "@/components/dashboard/new-appointment-dialog"
import {
  mockAppointments,
  mockDoctors,
  mockPatients,
} from "@/lib/mock-data"
import type { Appointment, AppointmentStatus } from "@/lib/types"

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showNewDialog, setShowNewDialog] = useState(false)

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (statusFilter !== "all" && a.status !== statusFilter) return false
        if (doctorFilter !== "all" && a.doctor_id !== doctorFilter) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          const matchTitle = a.title.toLowerCase().includes(q)
          const matchPatient =
            a.patient &&
            `${a.patient.first_name} ${a.patient.last_name}`
              .toLowerCase()
              .includes(q)
          const matchDoctor =
            a.doctor &&
            `${a.doctor.first_name} ${a.doctor.last_name}`
              .toLowerCase()
              .includes(q)
          if (!matchTitle && !matchPatient && !matchDoctor) return false
        }
        return true
      })
      .sort(
        (a, b) =>
          new Date(b.scheduled_at).getTime() -
          new Date(a.scheduled_at).getTime(),
      )
  }, [appointments, statusFilter, doctorFilter, searchQuery])

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status, updated_at: new Date().toISOString() } : a,
      ),
    )
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) =>
        prev ? { ...prev, status, updated_at: new Date().toISOString() } : prev,
      )
    }
  }

  const handleNewAppointment = (data: {
    title: string
    description: string
    doctor_id: string
    patient_id: string
    scheduled_at: string
    duration_minutes: number
  }) => {
    const patient = mockPatients.find((p) => p.id === data.patient_id)
    const doctor = mockDoctors.find((d) => d.id === data.doctor_id)

    const newApt: Appointment = {
      id: `a${Date.now()}`,
      ...data,
      status: "scheduled",
      notes: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient,
      doctor,
    }
    setAppointments((prev) => [newApt, ...prev])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewAppointment={() => setShowNewDialog(true)}
      />

      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StatsCards appointments={appointments} />

          <div className="mt-6">
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              doctorFilter={doctorFilter}
              onDoctorFilterChange={setDoctorFilter}
              doctors={mockDoctors}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <AppointmentList
                  appointments={filteredAppointments}
                  selectedId={selectedAppointment?.id ?? null}
                  onSelect={setSelectedAppointment}
                  onStatusChange={handleStatusChange}
                />
                {selectedAppointment && (
                  <div className="hidden xl:block">
                    <AppointmentDetail
                      appointment={selectedAppointment}
                      onClose={() => setSelectedAppointment(null)}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                )}
              </div>

              {/* Mobile detail panel */}
              {selectedAppointment && (
                <div className="xl:hidden">
                  <AppointmentDetail
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <CalendarSidebar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                appointments={appointments}
              />
            </aside>
          </div>
        </div>
      </main>

      <NewAppointmentDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        doctors={mockDoctors}
        patients={mockPatients}
        onSubmit={handleNewAppointment}
      />
    </div>
  )
}
