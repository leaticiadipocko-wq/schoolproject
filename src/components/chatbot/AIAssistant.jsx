import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const DEMO_RESPONSES = {
  greeting: "Hello! I'm the SIARM assistant. How can I help you today?",
  timetable: "You can view your timetable by navigating to the Timetable section in the sidebar. It shows your weekly schedule including course times, rooms, and lecturers.",
  fees: "To check your fees, go to the Fees section. You can view your balance, payment history, and make payments via MTN MoMo, Orange Money, or bank transfer.",
  results: "Your results are available in the Results section. You can view CA scores, exam marks, and final grades for each course.",
  default: "I'm here to help with questions about SIARM — the Smart Institution Academic Resource Management platform. You can ask about timetables, fees, results, attendance, or any other feature.",
}

function getResponse(input) {
  const lower = input.toLowerCase()
  if (lower.includes('timetable') || lower.includes('schedule')) return DEMO_RESPONSES.timetable
  if (lower.includes('fee') || lower.includes('payment') || lower.includes('tuition')) return DEMO_RESPONSES.fees
  if (lower.includes('result') || lower.includes('grade') || lower.includes('score')) return DEMO_RESPONSES.results
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return DEMO_RESPONSES.greeting
  return DEMO_RESPONSES.default
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: DEMO_RESPONSES.greeting },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = { id: Date.now() + 1, role: 'assistant', text: getResponse(text) }
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 800)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-800 text-white shadow-lg hover:bg-brand-700 transition flex items-center justify-center"
        title="AI Assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-ink-200 flex flex-col overflow-hidden" style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="bg-brand-800 text-white px-4 py-3 flex items-center gap-2">
            <Bot size={20} />
            <div>
              <div className="font-semibold text-sm">SIARM Assistant</div>
              <div className="text-xs text-brand-200">Ask me anything about the platform</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '280px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-brand-800 text-white rounded-br-sm'
                      : 'bg-ink-100 text-ink-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-ink-200 text-ink-600 flex items-center justify-center shrink-0">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="px-3 py-2 rounded-xl bg-ink-100 text-ink-500 text-sm rounded-bl-sm">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-ink-200 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask a question..."
              className="flex-1 input py-2 text-sm"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-brand-800 text-white hover:bg-brand-700 disabled:opacity-40 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
