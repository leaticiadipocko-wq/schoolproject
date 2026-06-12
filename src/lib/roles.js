// Role-based access control for SIARM
// The hierarchy ensures admin > staff > lecturer > student capability levels.

export const ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  STAFF: 'staff',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  student: 'Student',
  lecturer: 'Lecturer',
  staff: 'Academic Staff',
  admin: 'Administrator',
}

export const ROLE_HIERARCHY = {
  student: 1,
  lecturer: 2,
  staff: 3,
  admin: 4,
}

export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export const roleHome = (role) => {
  switch (role) {
    case ROLES.STUDENT:  return '/student'
    case ROLES.LECTURER: return '/lecturer'
    case ROLES.STAFF:    return '/staff'
    case ROLES.ADMIN:    return '/admin'
    default: return '/login'
  }
}
