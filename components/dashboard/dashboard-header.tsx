"use client"

import { Activity, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewAppointment: () => void
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  onNewAppointment,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none tracking-tight text-card-foreground">
            MedScribe
          </h1>
          <p className="text-xs text-muted-foreground">Appointment Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 pl-9"
          />
        </div>
        <Button onClick={onNewAppointment} size="sm">
          New Appointment
        </Button>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            SC
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
