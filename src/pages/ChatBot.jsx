import { useState, useRef, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import { MessageCircle, Send, X, Bot, User, Sparkles, GraduationCap, TrendingUp } from 'lucide-react'

const GRADE_ADVICE = {
  A: 'Excellent! Keep up the great work. Consider mentoring classmates.',
  'B+': 'Very good! You have a strong understanding. Aim for that A next.',
  B: 'Good progress. Review your weak areas and practice more problems.',
  'C+': 'Fair. Schedule extra tutorials and form study groups.',
  C: 'Needs improvement. Visit the lecturer during office hours.',
  D: 'At risk. Please seek immediate academic counselling.',
  F: 'Critical. Speak with your lecturer and academic advisor today.',
}

function getAcademicAdvice(user, results, attendance, fees) {
  const role = user?.role || 'guest'
  let tips = []

  if (role === 'student') {
    if (results?.length > 0) {
      const lowest = results.reduce((min, r) => r.total < min.total ? r : min, results[0])
      tips.push(`Your lowest score is ${lowest.course} (${lowest.total}%, ${lowest.grade}). ${GRADE_ADVICE[lowest.grade] || 'Focus on improving this course.'}`)
      const strong = results.filter(r => r.grade === 'A' || r.grade === 'B+')
      if (strong.length >= 3) tips.push(`You have ${strong.length} strong grades — you are on track for honours!`)
      if (results.some(r => r.grade === 'D' || r.grade === 'F')) tips.push('Some grades need urgent attention. The Academic Support Centre is open Mon-Fri 9am-4pm.')
    }
    if (attendance?.length > 0) {
      const low = attendance.filter(a => a.percent < 80)
      if (low.length > 0) tips.push(`Your attendance in ${low.map(a => a.course).join(', ')} is below 80%. Regular attendance improves performance.`)
    }
    if (fees?.balance > 0) tips.push(`You have an outstanding fee balance of ${Number(fees.balance).toLocaleString()} FCFA. Pay before the deadline to avoid late fees.`)
  }

  if (role === 'lecturer') {
    tips.push('Your teaching materials can be published via the Publish Lesson page.')
    tips.push('Remember to submit grades before the deadline.')
  }

  if (role === 'admin' || role === 'staff') {
    tips.push(`${results?.length || 0} results recorded in the system.`)
    tips.push('Check the Analytics dashboard for enrollment and attendance trends.')
  }

  if (tips.length === 0) tips.push('Explore the sidebar to access all available modules.')
  return tips
}

const WELCOME_MSG = {
  role: 'bot',
  text: "Hello! I'm your SIARM AI Academic Advisor. I can help with course advice, grade analysis, attendance tips, fee reminders, and general platform questions. How can I support you today?",
  timestamp: new Date().toISOString(),
}

export default function ChatBot() {
  const { user } = useAuth()
  const { lang } = useLang()
  const { results = [], attendance = [], fees = {} } = useData()
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [advisorMode, setAdvisorMode] = useState(false)
  const msgsEndRef = useRef(null)
  const inputRef = useRef(null)

  const academicAdvice = useMemo(() => getAcademicAdvice(user, results, attendance, fees), [user, results, attendance, fees])

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const showAdvice = () => {
    const adviceText = academicAdvice.map((t, i) => `${i + 1}. ${t}`).join('\n\n')
    setMessages(prev => [...prev, { role: 'user', text: 'Give me personalised academic advice', timestamp: new Date().toISOString() }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: `Here is your personalised academic advice:\n\n${adviceText}\n\nWould you like me to elaborate on any of these points?`, timestamp: new Date().toISOString() }])
    }, 500)
  }

  const sendQuery = async () => {
    if (!text.trim()) return
    const q = text.trim()
    setText('')
    setMessages(prev => [...prev, { role: 'user', text: q, timestamp: new Date().toISOString() }])
    setLoading(true)

    const lower = q.toLowerCase()
    if (lower.includes('advice') || lower.includes('tip') || lower.includes('suggest') || lower.includes('recommend') || lower.includes('improve')) {
      setTimeout(() => {
        const adviceText = academicAdvice.map((t, i) => `${i + 1}. ${t}`).join('\n\n')
        setMessages(prev => [...prev, { role: 'bot', text: `Based on your data:\n\n${adviceText}\n\nI am here if you need more specific guidance!`, timestamp: new Date().toISOString() }])
        setLoading(false)
      }, 800)
      return
    }

    if (lower.includes('grade') || lower.includes('result')) {
      if (results.length > 0) {
        const gradeSummary = results.map(r => `${r.course}: ${r.ca}+${r.exam}=${r.total} (${r.grade})`).join('\n')
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'bot', text: `Here are your results:\n\n${gradeSummary}\n\nYour current GPA trend: ${results.filter(r => r.grade === 'A' || r.grade === 'B+').length}/${results.length} strong grades.`, timestamp: new Date().toISOString() }])
          setLoading(false)
        }, 500)
        return
      }
    }

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, userName: user?.name || 'User' }),
      })
      const json = await res.json()
      if (json.success) {
        setMessages(prev => [...prev, { role: 'bot', text: json.data.reply, timestamp: json.data.timestamp }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not process that request. Please try again.', timestamp: new Date().toISOString() }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please check your connection and try again.', timestamp: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuery()
    }
  }

  const quickReplies = [
    { label: 'Advice', query: 'Give me personalised academic advice', icon: GraduationCap },
    { label: 'Grades', query: 'Show me my grade analysis', icon: TrendingUp },
    { label: 'Fees', query: 'Tell me about fees and payments', icon: Sparkles },
    { label: 'Timetable', query: 'Show me the class timetable', icon: Sparkles },
    { label: 'Library', query: 'What are the library hours?', icon: Sparkles },
    { label: 'Help', query: 'I need help with the portal', icon: Sparkles },
  ]

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 hover:scale-105 transition-all flex items-center justify-center"
        title={lang === 'en' ? 'Open AI Advisor' : 'Ouvrir le conseiller IA'}
      >
        <GraduationCap size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-ink-100">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <GraduationCap size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">SIARM AI Advisor</div>
          <div className="text-[11px] text-white/70">Personalised academic intelligence</div>
        </div>
        <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-ink-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-100' : 'bg-ink-200'}`}>
              {msg.role === 'user' ? <User size={14} className="text-brand-600" /> : <GraduationCap size={14} className="text-ink-600" />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-tr-md'
                : 'bg-white text-ink-800 rounded-tl-md shadow-soft border border-ink-100'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-ink-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center shrink-0">
              <GraduationCap size={14} className="text-ink-600" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-soft border border-ink-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-ink-100">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => { setText(qr.query); setTimeout(() => inputRef.current?.focus(), 50) }}
              className="text-xs px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition font-medium"
            >
              <qr.icon size={10} className="inline mr-1" />
              {qr.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-ink-100 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className="input pr-4 py-2.5 text-sm"
              placeholder="Ask for advice, grades, help..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <button
            onClick={sendQuery}
            disabled={!text.trim() || loading}
            className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}