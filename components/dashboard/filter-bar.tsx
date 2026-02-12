"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AppointmentStatus } from "@/lib/types"
import type { Profile } from "@/lib/types"

interface FilterBarProps {
  statusFilter: AppointmentStatus | "all"
  onStatusFilterChange: (value: AppointmentStatus | "all") => void
  doctorFilter: string
  onDoctorFilterChange: (value: string) => void
  doctors: Profile[]
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  doctorFilter,
  onDoctorFilterChange,
  doctors,
}: FilterBarProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <Tabs
        value={statusFilter}
        onValueChange={(v) => onStatusFilterChange(v as AppointmentStatus | "all")}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select value={doctorFilter} onValueChange={onDoctorFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Doctors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {doctors.map((doc) => (
            <SelectItem key={doc.id} value={doc.id}>
              Dr. {doc.first_name} {doc.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
