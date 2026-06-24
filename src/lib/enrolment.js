// Pure enrolment helpers — extracted so they can be unit-tested in isolation.
// Used by the staff/admin enrolment pipeline to derive a student's matricule
// and institutional e-mail from a single submission.

// Build a matricule of the form IUGET/<year>/<SPECIALTY>/<NNNN>.
// `count` is the zero-based index of the student within the current batch.
export function makeMatricule(specialty, count, year = new Date().getFullYear()) {
  return `IUGET/${year}/${specialty}/${String(140 + count).padStart(4, '0')}`
}

// Derive the institutional e-mail from the student's name and matricule,
// e.g. ("John Doe", "IUGET/2026/SWE/0140") -> "doe.0140@iuget.cm".
export function makeEmail(name, matricule) {
  const last = String(name).trim().split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, '')
  const num = matricule.split('/').pop()
  return `${last}.${num}@iuget.cm`
}
