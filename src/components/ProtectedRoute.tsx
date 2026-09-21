import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setAuthenticated(!!session)
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080d18] text-white flex items-center justify-center">
        <p className="text-sm text-slate-400">
          Checking your session...
        </p>
      </main>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute