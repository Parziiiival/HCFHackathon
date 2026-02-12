'use client'

import Link from 'next/link'
import {
  Heart,
  Brain,
  Syringe,
  Scale,
  Bone,
  Stethoscope,
  Ear,
  Eye,
  Baby,
  AlertCircle,
  Activity,
  FlaskConical,
  Dna,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { MEDICAL_DEPARTMENTS } from '@/lib/medical-departments'

const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  cardiac: Heart,
  neuro: Brain,
  anaesthesia: Syringe,
  forensics: Scale,
  'general-surgery': Stethoscope,
  orthopaedics: Bone,
  ent: Ear,
  ophthalmology: Eye,
  dermatology: Sparkles,
  gynaecology: Baby,
  paediatrics: Baby,
  emergency: AlertCircle,
  urology: Activity,
  vascular: Heart,
  plastic: FlaskConical,
  oncology: Dna,
}

export function DepartmentsPanel() {
  return (
    <section className="w-full border-t border-slate-200 bg-slate-50/80 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Medical Departments
          </h2>
          <p className="mt-2 text-slate-600">
            Browse our surgical and operational departments
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MEDICAL_DEPARTMENTS.map((dept) => {
            const Icon = DEPARTMENT_ICONS[dept.id] ?? Stethoscope
            return (
              <Link
                key={dept.id}
                href={`/appointments/create?department=${dept.id}`}
                className="group rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 group-hover:bg-sky-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-sky-700">
                      {dept.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                      {dept.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/appointments/create"
            className="inline-flex items-center rounded-lg border-2 border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50 hover:border-sky-300"
          >
            Book an appointment
          </Link>
        </div>
      </div>
    </section>
  )
}
