"use client"

import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Appointment } from "@/lib/types"

interface StatsCardsProps {
  appointments: Appointment[]
}

export function StatsCards({ appointments }: StatsCardsProps) {
  const total = appointments.length
  const scheduled = appointments.filter((a) => a.status === "scheduled").length
  const completed = appointments.filter((a) => a.status === "completed").length
  const cancelled = appointments.filter((a) => a.status === "cancelled").length

  const stats = [
    {
      label: "Total",
      value: total,
      icon: CalendarDays,
      color: "text-primary" as const,
      bg: "bg-primary/10" as const,
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: Clock,
      color: "text-[hsl(var(--warning))]" as const,
      bg: "bg-[hsl(var(--warning))]/10" as const,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-[hsl(var(--success))]" as const,
      bg: "bg-[hsl(var(--success))]/10" as const,
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "text-destructive" as const,
      bg: "bg-destructive/10" as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
