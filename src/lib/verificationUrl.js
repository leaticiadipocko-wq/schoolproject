/**
 * Generate verification URLs using the current origin
 * This ensures QR codes work both in development and production
 */

export function getVerificationBaseUrl() {
  // Use the current origin in browser, or fallback for SSR
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for server-side rendering or build time
  return 'https://verify.iuget.cm'
}

export function getTranscriptVerificationUrl(studentId) {
  const base = getVerificationBaseUrl()
  // Extract the last part of the student ID (after the last /)
  const shortId = studentId?.split('/').pop() || studentId || 'student'
  return `${base}/verify/transcript/${shortId}`
}

export function getResultsVerificationUrl(studentId) {
  const base = getVerificationBaseUrl()
  const shortId = studentId?.split('/').pop() || studentId || 'student'
  return `${base}/verify/results/${shortId}`
}

export function getReceiptVerificationUrl(receiptRef) {
  const base = getVerificationBaseUrl()
  return `${base}/verify/receipt/${receiptRef}`
}

export function getStudentVerificationUrl(studentId) {
  const base = getVerificationBaseUrl()
  const shortId = studentId?.split('/').pop() || studentId || 'student'
  return `${base}/verify/student/${shortId}`
}

export function getMinesupVerificationUrl(docRef) {
  const base = getVerificationBaseUrl()
  const shortRef = docRef?.split('/').pop() || docRef
  return `${base}/verify/minesup/${shortRef}`
}

export function getEnrollmentVerificationUrl(matricule, receiptRef) {
  const base = getVerificationBaseUrl()
  const shortMatricule = matricule?.split('/').pop() || matricule
  return `${base}/verify/enrollment/${shortMatricule}/${receiptRef}`
}