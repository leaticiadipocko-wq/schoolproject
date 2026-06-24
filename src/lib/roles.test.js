import { describe, it, expect } from 'vitest'
import { hasRole, roleHome, ROLES } from './roles'

describe('roles — hierarchical RBAC', () => {
  it('admin satisfies every lower role', () => {
    expect(hasRole('admin', 'student')).toBe(true)
    expect(hasRole('admin', 'lecturer')).toBe(true)
    expect(hasRole('admin', 'staff')).toBe(true)
    expect(hasRole('admin', 'admin')).toBe(true)
  })

  it('a lower role cannot satisfy a higher requirement', () => {
    expect(hasRole('student', 'lecturer')).toBe(false)
    expect(hasRole('lecturer', 'staff')).toBe(false)
    expect(hasRole('staff', 'admin')).toBe(false)
  })

  it('a role satisfies its own requirement', () => {
    expect(hasRole('lecturer', 'lecturer')).toBe(true)
  })

  it('returns false for missing or unknown roles', () => {
    expect(hasRole(undefined, 'student')).toBe(false)
    expect(hasRole('student', undefined)).toBe(false)
  })

  it('routes each role to its home surface', () => {
    expect(roleHome(ROLES.STUDENT)).toBe('/student')
    expect(roleHome(ROLES.LECTURER)).toBe('/lecturer')
    expect(roleHome(ROLES.STAFF)).toBe('/staff')
    expect(roleHome(ROLES.ADMIN)).toBe('/admin')
    expect(roleHome('unknown')).toBe('/login')
  })
})
