export type Doctor = {
  id: string
  name: string
  specialization: string
  email?: string
}

// Available doctors - in production, fetch from Supabase profiles where user_type = 'doctor'
export const AVAILABLE_DOCTORS: Doctor[] = [
  { id: 'dr-smith', name: 'Dr. Smith', specialization: 'General Practice' },
  { id: 'dr-lee', name: 'Dr. Lee', specialization: 'Internal Medicine' },
  { id: 'dr-patel', name: 'Dr. Patel', specialization: 'Dermatology' },
  { id: 'dr-johnson', name: 'Dr. Johnson', specialization: 'Cardiology' },
  { id: 'dr-williams', name: 'Dr. Williams', specialization: 'Pediatrics' },
]
