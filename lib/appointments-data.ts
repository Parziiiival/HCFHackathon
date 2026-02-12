export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export type Appointment = {
  id: string
  title: string
  doctorName: string
  patientName: string
  status: AppointmentStatus
  date: string // ISO string
}

export const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Follow-up consultation',
    doctorName: 'Dr. Smith',
    patientName: 'John Doe',
    status: 'scheduled',
    date: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Annual health check',
    doctorName: 'Dr. Lee',
    patientName: 'John Doe',
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Dermatology review',
    doctorName: 'Dr. Patel',
    patientName: 'John Doe',
    status: 'cancelled',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

