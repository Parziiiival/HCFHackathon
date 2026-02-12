"use client"

import { format } from "date-fns"
import { Clock, MoreHorizontal, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Appointment, AppointmentStatus } from "@/lib/types"

interface AppointmentListProps {
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (appointment: Appointment) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const variants: Record<AppointmentStatus, { className: string; label: string }> = {
    scheduled: {
      className: "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
      label: "Scheduled",
    },
    completed: {
      className: "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
      label: "Completed",
    },
    cancelled: {
      className: "border-destructive/30 bg-destructive/10 text-destructive",
      label: "Cancelled",
    },
  }

  const { className, label } = variants[status]

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}

export function AppointmentList({
  appointments,
  selectedId,
  onSelect,
  onStatusChange,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-card-foreground">No appointments found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your filters or create a new appointment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Appointments ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {appointments.map((appointment) => {
            const isSelected = selectedId === appointment.id
            return (
              <button
                key={appointment.id}
                type="button"
                onClick={() => onSelect(appointment)}
                className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50 ${
                  isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {appointment.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {appointment.patient
                          ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                          : "Unknown Patient"}
                      </span>
                      <span aria-hidden="true">{"/"}</span>
                      <span>
                        Dr.{" "}
                        {appointment.doctor
                          ? appointment.doctor.last_name
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(appointment.scheduled_at), "MMM d, yyyy")}
                        {" at "}
                        {format(new Date(appointment.scheduled_at), "h:mm a")}
                      </span>
                      <span aria-hidden="true">{"/"}</span>
                      <span>{appointment.duration_minutes} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={appointment.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {appointment.status !== "completed" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(appointment.id, "completed")
                          }}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {appointment.status !== "cancelled" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(appointment.id, "cancelled")
                          }}
                          className="text-destructive"
                        >
                          Cancel Appointment
                        </DropdownMenuItem>
                      )}
                      {appointment.status !== "scheduled" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(appointment.id, "scheduled")
                          }}
                        >
                          Reschedule
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
