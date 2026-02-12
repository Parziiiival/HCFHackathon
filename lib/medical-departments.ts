export type MedicalDepartment = {
  id: string
  name: string
  description: string
}

export const MEDICAL_DEPARTMENTS: MedicalDepartment[] = [
  {
    id: 'cardiac',
    name: 'Cardiac',
    description: 'Heart surgeries, angioplasty, bypass, pacemaker implants',
  },
  {
    id: 'neuro',
    name: 'Neurology & Neurosurgery',
    description: 'Brain surgery, spine surgery, stroke care, epilepsy treatment',
  },
  {
    id: 'anaesthesia',
    name: 'Anaesthesia',
    description: 'General & regional anaesthesia, pain management, critical care',
  },
  {
    id: 'forensics',
    name: 'Forensics',
    description: 'Medicolegal examinations, autopsy, injury assessment',
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    description: 'Joint replacement, fracture repair, spinal correction',
  },
  {
    id: 'general-surgery',
    name: 'General Surgery',
    description: 'Appendectomy, hernia repair, gallbladder, gastrointestinal',
  },
  {
    id: 'ent',
    name: 'ENT',
    description: 'Ear, nose, throat surgery, cochlear implants, sinus surgery',
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    description: 'Cataract, LASIK, retinal surgery, glaucoma treatment',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin surgery, mole removal, cosmetic procedures',
  },
  {
    id: 'gynaecology',
    name: 'Gynaecology & Obstetrics',
    description: 'C-section, hysterectomy, fertility treatments',
  },
  {
    id: 'paediatrics',
    name: 'Paediatric Surgery',
    description: 'Surgery for infants and children, congenital corrections',
  },
  {
    id: 'emergency',
    name: 'Emergency Medicine',
    description: 'Trauma care, resuscitation, emergency procedures',
  },
  {
    id: 'urology',
    name: 'Urology',
    description: 'Kidney, bladder, prostate surgery, transplants',
  },
  {
    id: 'vascular',
    name: 'Vascular Surgery',
    description: 'Artery repair, vein surgery, aneurysm treatment',
  },
  {
    id: 'plastic',
    name: 'Plastic & Reconstructive',
    description: 'Reconstructive surgery, burns, craniofacial repair',
  },
  {
    id: 'oncology',
    name: 'Surgical Oncology',
    description: 'Cancer surgery, tumour removal, lymph node dissection',
  },
]
