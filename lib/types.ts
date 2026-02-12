export type AppointmentStatus = "scheduled" | "completed" | "cancelled"

export type UserType = "patient" | "doctor"

export interface Profile {
  id: string
  user_type: UserType
  first_name: string
  last_name: string
  email: string
  phone?: string
  specialization?: string
  bio?: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  title: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  status: AppointmentStatus
  notes?: string
  created_at: string
  updated_at: string
  patient?: Profile
  doctor?: Profile
}

export interface Transcription {
  id: string
  appointment_id: string
  audio_file_path: string
  transcription_text?: string
  status: "pending" | "processing" | "completed" | "failed"
  error_message?: string
  created_at: string
  updated_at: string
}

export interface ExtractedEntity {
  id: string
  transcription_id: string
  entity_text: string
  entity_type: string
  start_position?: number
  end_position?: number
  confidence?: number
  created_at: string
}
