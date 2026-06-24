import { describe, it, expect } from 'vitest'
import { makeMatricule, makeEmail } from './enrolment'

describe('enrolment — matricule generation', () => {
  it('formats a matricule as IUGET/<year>/<SPEC>/<NNNN>', () => {
    expect(makeMatricule('SWE', 0, 2026)).toBe('IUGET/2026/SWE/0140')
    expect(makeMatricule('CNSM', 5, 2026)).toBe('IUGET/2026/CNSM/0145')
  })

  it('zero-pads the sequence to four digits', () => {
    expect(makeMatricule('BST', 0, 2025)).toMatch(/\/0140$/)
    expect(makeMatricule('BST', 60, 2025)).toMatch(/\/0200$/)
  })

  it('defaults to the current year when none is given', () => {
    const y = new Date().getFullYear()
    expect(makeMatricule('SWE', 0)).toBe(`IUGET/${y}/SWE/0140`)
  })
})

describe('enrolment — institutional e-mail generation', () => {
  it('derives <lastname>.<seq>@iuget.cm from name and matricule', () => {
    expect(makeEmail('John Doe', 'IUGET/2026/SWE/0140')).toBe('doe.0140@iuget.cm')
  })

  it('uses the final name token and strips non-letters', () => {
    expect(makeEmail('Marie-Claire  N’Komo', 'IUGET/2026/BST/0151')).toBe('nkomo.0151@iuget.cm')
  })

  it('lower-cases the surname', () => {
    expect(makeEmail('AMINA BELLO', 'IUGET/2026/CNSM/0142')).toBe('bello.0142@iuget.cm')
  })
})
