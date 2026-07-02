/**
 * AI Service - Production-ready chatbot integration
 * 
 * SECURITY NOTE: In production, all AI requests MUST be proxied through a backend.
 * This prevents API key exposure on the client side.
 * 
 * Current setup: Development/Defense demo only
 * Production setup: Create backend endpoint at /api/ai/chat
 */

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

// Demo responses for defense without API
const DEMO_RESPONSES = {
  'attendance': 'Your attendance is 95% this semester. You have attended 38 out of 40 classes.',
  'grades': 'Your current GPA is 3.8. You have an A in Computer Science and B+ in Mathematics.',
  'timetable': 'Your classes are scheduled Monday-Friday, 8am-4pm at the Bonaberi campus.',
  'fees': 'Outstanding fees: $500. Due date: 2026-07-15. Contact finance@iuget.cm for payment options.',
  'exam': 'Next exam: Final Programming - July 20, 2026, 10:00-12:00, Hall A, Bonaberi.',
  'campus': 'SIARM supports both Bonaberi and Bonamoussadi campuses with real-time synchronization.',
  'default': 'Hello! I\'m the SIARM AI Assistant. I can help you with attendance, grades, timetables, fees, exams, and campus information. What would you like to know?',
}

/**
 * Chat with AI assistant
 * @param {string} message - User message
 * @param {string} role - User role (student, lecturer, staff, admin)
 * @param {string} context - Additional context (e.g., campus, department)
 * @returns {Promise<string>} AI response
 */
export async function chatWithAI(message, role = 'student', context = {}) {
  try {
    // Demo mode for defense
    if (DEMO_MODE || !API_KEY) {
      return getDemoResponse(message)
    }

    // Production: Use backend proxy
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        role,
        context,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('AI Chat error:', error)
    return 'I apologize, but I couldn\'t process your request. Please try again or contact support.'
  }
}

/**
 * Get context-aware AI response for student queries
 * @param {Object} studentData - Student profile data
 * @returns {Promise<string>} Personalized response
 */
export async function getStudentInsight(studentData) {
  const context = `
    Student: ${studentData.name}
    Current GPA: ${studentData.gpa}
    Attendance: ${studentData.attendance}%
    Campus: ${studentData.campus}
  `

  const prompt = `Based on this student profile, provide one key recommendation for academic improvement: ${context}`

  return chatWithAI(prompt, 'student', studentData)
}

/**
 * Get predictive enrollment recommendations
 * @param {Object} enrollmentData - Enrollment statistics
 * @returns {Promise<string>} Predictive insight
 */
export async function getPredictiveEnrollment(enrollmentData) {
  const prompt = `Analyze this enrollment data and predict trends: ${JSON.stringify(enrollmentData)}`
  return chatWithAI(prompt, 'admin', { type: 'predictive_analytics' })
}

/**
 * Get course recommendations for student
 * @param {Array} completedCourses - Courses taken
 * @param {string} major - Student major
 * @returns {Promise<string>} Course recommendations
 */
export async function getRecommendedCourses(completedCourses, major) {
  const prompt = `Given completed courses: ${completedCourses.join(', ')} and major: ${major}, recommend next courses`
  return chatWithAI(prompt, 'student', { major, completedCourses })
}

/**
 * Generate decision support insights
 * @param {Object} metrics - Performance metrics
 * @returns {Promise<string>} Decision support analysis
 */
export async function getDecisionSupport(metrics) {
  const prompt = `Based on these institutional metrics: ${JSON.stringify(metrics)}, provide actionable insights for management`
  return chatWithAI(prompt, 'admin', { type: 'decision_support' })
}

/**
 * Demo response generator
 * @private
 */
function getDemoResponse(message) {
  const msg = message.toLowerCase()
  
  // Check for keywords
  for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
    if (key !== 'default' && msg.includes(key)) {
      return response
    }
  }

  return DEMO_RESPONSES.default
}

/**
 * Stream chat responses (for real-time UI updates)
 * @param {string} message - User message
 * @param {Function} onChunk - Callback for each chunk
 * @param {string} role - User role
 */
export async function* streamChat(message, role = 'student') {
  if (DEMO_MODE || !API_KEY) {
    // Demo streaming
    const response = getDemoResponse(message)
    for (const chunk of response.split(' ')) {
      yield chunk + ' '
      await new Promise(r => setTimeout(r, 50)) // Simulate streaming
    }
    return
  }

  try {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, role }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      yield chunk
    }
  } catch (error) {
    console.error('Stream error:', error)
  }
}

export default {
  chatWithAI,
  getStudentInsight,
  getPredictiveEnrollment,
  getRecommendedCourses,
  getDecisionSupport,
  streamChat,
}
