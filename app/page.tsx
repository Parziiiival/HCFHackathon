import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Automating the Consulting Room
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          MedEz
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Track Appointments, Manage Profiles, and Review Prescriptions and
          Diagnoses
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex w-64 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Patient login
          </Link>
          <Link
            href="/doctor-login"
            className="inline-flex w-64 items-center justify-center rounded-md border px-5 py-3 text-sm font-medium hover:bg-accent"
          >
            Doctor login
          </Link>
        </div>
      </div>
    </main>
  );
}
