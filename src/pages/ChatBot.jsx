import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react'

const WELCOME_MSG = {
  role: 'bot',
  text: "Hello! I'm the SIARM Academic Assistant. Ask me about fees, results, timetable, registration, assignments, library, hostel, or deadlines. How can I help you today?",
  timestamp: new Date().toISOString(),
}

export default function ChatBot() {
  const { user } = useAuth()
  const { lang } = useLang()
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const msgsEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendQuery = async () => {
    if (!text.trim()) return
    const q = text.trim()
    setText('')
    setMessages(prev => [...prev, { role: 'user', text: q, timestamp: new Date().toISOString() }])
    setLoading(true)
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
    { label: 'Fees', query: 'Tell me about fees and payments' },
    { label: 'Results', query: 'How can I check my results?' },
    { label: 'Timetable', query: 'Show me the class timetable' },
    { label: 'Registration', query: 'How do I register for courses?' },
    { label: 'Library', query: 'What are the library hours?' },
    { label: 'Help', query: 'I need help with the portal' },
  ]

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 hover:scale-105 transition-all flex items-center justify-center"
        title={lang === 'en' ? 'Open Chatbot' : 'Ouvrir le chatbot'}
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-ink-100">
      {/* Header */}
      <div className="bg-brand-600 text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Bot size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">SIARM Assistant</div>
          <div className="text-[11px] text-white/70">Online • AI-powered</div>
        </div>
        <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-ink-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-100' : 'bg-ink-200'}`}>
              {msg.role === 'user' ? <User size={14} className="text-brand-600" /> : <Bot size={14} className="text-ink-600" />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-tr-md'
                : 'bg-white text-ink-800 rounded-tl-md shadow-soft border border-ink-100'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-ink-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-ink-600" />
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

      {/* Quick replies */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-ink-100">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => { setText(qr.query); setTimeout(() => inputRef.current?.focus(), 50) }}
              className="text-xs px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition font-medium"
            >
              <Sparkles size={10} className="inline mr-1" />
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-ink-100 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className="input pr-4 py-2.5 text-sm"
              placeholder={lang === 'en' ? 'Ask a question...' : 'Posez une question...'}
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
