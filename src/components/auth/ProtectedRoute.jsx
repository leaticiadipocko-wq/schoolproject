import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROLES } from '@/lib/roles'

/**
 * Strict role-based route guard.
 * - Student  → ONLY /student/* (view own resources, upload docs)
 * - Lecturer → ONLY /lecturer/* (teaching duties only)
 * - Staff    → /staff/* AND /admin/* (staff+admin overlap)
 * - Admin    → /admin/* AND /staff/* (admin+staff overlap)
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="flex items-center gap-3 text-ink-500">
          <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <span>Loading…</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = user.role

  // Student — can ONLY access /student/* routes
  if (role === ROLES.STUDENT) {
    if (requiredRole !== ROLES.STUDENT) return <Navigate to="/student" replace />
    return children
  }

  // Lecturer — can ONLY access /lecturer/* routes
  if (role === ROLES.LECTURER) {
    if (requiredRole !== ROLES.LECTURER) return <Navigate to="/lecturer" replace />
    return children
  }

  // Staff — can access /staff/* and /admin/*
  if (role === ROLES.STAFF) {
    if (requiredRole === ROLES.ADMIN || requiredRole === ROLES.STAFF) return children
    return <Navigate to="/staff" replace />
  }

  // Admin — can access /admin/* and /staff/*
  if (role === ROLES.ADMIN) {
    if (requiredRole === ROLES.ADMIN || requiredRole === ROLES.STAFF) return children
    return <Navigate to="/admin" replace />
  }

  return children
}
