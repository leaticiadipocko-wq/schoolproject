import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROLES, ROLE_HIERARCHY } from '@/lib/roles'

/**
 * Guards a route based on auth state and **exact** role match.
 * - Students can ONLY access /student/* routes
 * - Lecturers can access /lecturer/* AND /student/* (they teach)
 * - Staff can access /staff/* AND /student/*, /lecturer/*
 * - Admins can access everything
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

  // Restrict students to student-only routes
  if (user.role === ROLES.STUDENT && requiredRole !== ROLES.STUDENT) {
    return <Navigate to="/student" replace />
  }

  // Lecturers can access lecturer and student routes
  if (user.role === ROLES.LECTURER && requiredRole === ROLES.ADMIN) {
    return <Navigate to="/lecturer" replace />
  }

  // Staff can access staff, lecturer, and student routes but not admin
  if (user.role === ROLES.STAFF && requiredRole === ROLES.ADMIN) {
    return <Navigate to="/staff" replace />
  }

  // Role hierarchy check: user must have sufficient rank
  if (requiredRole && !(ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole])) {
    if (user.role === ROLES.STUDENT) return <Navigate to="/student" replace />
    if (user.role === ROLES.LECTURER) return <Navigate to="/lecturer" replace />
    if (user.role === ROLES.STAFF) return <Navigate to="/staff" replace />
    return <Navigate to="/" replace />
  }

  return children
}
