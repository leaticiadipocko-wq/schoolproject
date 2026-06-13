export function gradeFor(total) {
  if (total >= 80) return 'A'
  if (total >= 70) return 'B+'
  if (total >= 60) return 'B'
  if (total >= 55) return 'C+'
  if (total >= 50) return 'C'
  if (total >= 40) return 'D'
  return 'F'
}
