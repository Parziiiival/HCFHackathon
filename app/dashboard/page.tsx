'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase-client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Check demo mode first
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        const demoUser = localStorage.getItem('demo_current_user')
        if (demoUser) {
          setUser(JSON.parse(demoUser))
          setLoading(false)
          return
        } else {
          router.push('/login')
          return
        }
      }

      try {
        // Check Supabase auth
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        setUser(user)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    // Check if demo mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
      localStorage.removeItem('demo_current_user')
      router.push('/')
      return
    }

    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-blue-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Log Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName || user?.user_metadata?.first_name || user?.email}</CardTitle>
            <CardDescription>Your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              {(user?.firstName || user?.user_metadata?.first_name) && (
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user?.firstName || user?.user_metadata?.first_name} {user?.lastName || user?.user_metadata?.last_name}
                  </p>
                </div>
              )}
              {(user?.userType || user?.user_metadata?.user_type) && (
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {user?.userType || user?.user_metadata?.user_type}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">User ID</label>
                <p className="text-gray-600 dark:text-gray-400 break-all">{user?.id}</p>
              </div>
              {user?.created_at && (
                <div>
                  <label className="text-sm font-medium">Account Created</label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📅 Appointments</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Schedule and manage your appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 Profile</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your profile information
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
