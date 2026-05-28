import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Info } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const STARTERS = [
  'When are the mid-semester exams?',
  'How do I apply for resit?',
  'What is my GPA requirement to graduate?',
  'Where is the library located?',
]

// Local rule-based responder for offline / no-API-key fallback.
// Demonstrates the chatbot UX even without Anthropic credentials.
function localResponse(q) {
  const text = q.toLowerCase()
  if (text.includes('exam')) return 'Mid-semester exams begin June 10. Check your timetable for room allocations and bring your student ID.'
  if (text.includes('resit')) return 'Resit registration is done via Student Portal → Academic → Resit. Fees apply per course. Deadline is two weeks before resit week.'
  if (text.includes('gpa') || text.includes('graduate')) return 'To graduate, you need a CGPA of at least 2.00 on a 4.00 scale, plus full credit completion.'
  if (text.includes('library')) return 'The main library is on the ground floor of Block C. It opens 7am–10pm during exam season.'
  if (text.includes('fee') || text.includes('tuition')) return 'Tuition deadline has been extended to June 5. Pay through the Bursary portal or at the cashier.'
  if (text.includes('hello') || text.includes('hi')) return 'Hello! I am SIARM AI, your university assistant. Ask me about exams, timetables, fees, or anything academic.'
  return 'I’m here to help with university enquiries. Try asking about exams, fees, attendance, timetables, or resits. (Live AI responses activate when an Anthropic API key is configured.)'
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I’m SIARM AI 👋 — your 24/7 university assistant. How can I help today?' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const q = text ?? input
    if (!q.trim()) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setSending(true)

    // Simulate thinking
    await new Promise((r) => setTimeout(r, 600))
    const answer = localResponse(q)
    setMessages((m) => [...m, { role: 'assistant', text: answer }])
    setSending(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Get instant answers to university enquiries"
      />

      <div className="card p-0 overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-ink-100 flex items-center gap-3 bg-gradient-to-r from-brand-50 to-accent-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <div className="font-display font-bold">SIARM AI</div>
            <div className="text-xs text-ink-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-ink-50/30">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-white text-ink-800 border border-ink-100 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-ink-200 text-ink-700 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-ink-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Starters (only if just 1 message) */}
        {messages.length <= 1 && (
          <div className="px-5 py-3 border-t border-ink-100 bg-white">
            <div className="text-xs text-ink-500 mb-2 flex items-center gap-1"><Sparkles size={12} /> Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-ink-100 hover:bg-brand-100 hover:text-brand-700 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="p-3 border-t border-ink-100 bg-white flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about SIARM University…"
            className="input"
          />
          <button type="submit" disabled={sending} className="btn-primary !rounded-xl !p-3">
            <Send size={18} />
          </button>
        </form>
      </div>

      <div className="text-xs text-ink-500 flex items-center gap-1.5">
        <Info size={12} /> Demo uses a local rules engine. Connect VITE_ANTHROPIC_API_KEY for live Claude-powered responses.
      </div>
    </div>
  )
}
