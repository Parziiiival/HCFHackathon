"use client"

import { format } from "date-fns"
import {
  CalendarDays,
  Clock,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  User,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Appointment, AppointmentStatus } from "@/lib/types"

interface AppointmentDetailProps {
  appointment: Appointment
  onClose: () => void
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

export function AppointmentDetail({
  appointment,
  onClose,
  onStatusChange,
}: AppointmentDetailProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{appointment.title}</CardTitle>
            <StatusBadge status={appointment.status} />
          </div>
          {appointment.description && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {appointment.description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Schedule Info */}
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-card-foreground">
              {format(new Date(appointment.scheduled_at), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-card-foreground">
              {format(new Date(appointment.scheduled_at), "h:mm a")} ({appointment.duration_minutes} min)
            </span>
          </div>
        </div>

        <Separator />

        {/* Patient Info */}
        {appointment.patient && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Patient
            </p>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">
                  {appointment.patient.first_name} {appointment.patient.last_name}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{appointment.patient.email}</span>
                </div>
                {appointment.patient.phone && (
                  <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{appointment.patient.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Doctor Info */}
        {appointment.doctor && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Doctor
            </p>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">
                  Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                </p>
                {appointment.doctor.specialization && (
                  <p className="mt-0.5 text-muted-foreground">
                    {appointment.doctor.specialization}
                  </p>
                )}
                <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{appointment.doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {appointment.notes && (
          <>
            <Separator />
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Notes
              </p>
              <div className="flex gap-2 rounded-lg bg-muted/50 p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-relaxed text-card-foreground">
                  {appointment.notes}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <Separator />
        <div className="flex gap-2">
          {appointment.status === "scheduled" && (
            <>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onStatusChange(appointment.id, "completed")}
              >
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onStatusChange(appointment.id, "cancelled")}
              >
                Cancel
              </Button>
            </>
          )}
          {appointment.status === "cancelled" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(appointment.id, "scheduled")}
            >
              Reschedule
            </Button>
          )}
          {appointment.status === "completed" && (
            <p className="text-xs text-muted-foreground">
              This appointment has been completed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
