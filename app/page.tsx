import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { DepartmentsPanel } from "@/components/DepartmentsPanel";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-5 py-2.5 text-sm text-sky-700 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Automating the Consulting Room
        </div>

        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-inner">
          <Stethoscope className="h-10 w-10" strokeWidth={2} />
        </div>
        <h1 className="text-balance text-5xl font-bold tracking-tight text-slate-800 sm:text-6xl">
          MedEz
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-600 sm:text-xl">
          Track Appointments, Manage Profiles, and Review Prescriptions and
          Diagnoses
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
          <Link
            href="/login"
            className="btn-vanilla inline-flex w-64 items-center justify-center rounded-lg bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 hover:shadow-md"
          >
            Patient login
          </Link>
          <Link
            href="/doctor-login"
            className="btn-vanilla inline-flex w-64 items-center justify-center rounded-lg border border-sky-200 bg-white px-6 py-3.5 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 hover:shadow-md"
          >
            Doctor login
          </Link>
        </div>
      </div>
      <DepartmentsPanel />
    </main>
  );
}
