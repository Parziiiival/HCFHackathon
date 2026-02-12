"use client"

import { format, isSameDay } from "date-fns"
import { Clock, Stethoscope } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Appointment } from "@/lib/types"

interface CalendarSidebarProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  appointments: Appointment[]
}

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  appointments,
}: CalendarSidebarProps) {
  const scheduledDates = appointments
    .filter((a) => a.status === "scheduled")
    .map((a) => new Date(a.scheduled_at))

  const todayAppointments = appointments.filter((a) =>
    isSameDay(new Date(a.scheduled_at), selectedDate ?? new Date()),
  )

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            modifiers={{
              hasAppointment: scheduledDates,
            }}
            modifiersClassNames={{
              hasAppointment: "bg-primary/15 text-primary font-semibold",
            }}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {selectedDate
              ? format(selectedDate, "MMM d, yyyy")
              : "Today"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No appointments on this day.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground leading-relaxed">
                      {apt.title}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(apt.scheduled_at), "h:mm a")} /{" "}
                        {apt.duration_minutes}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
