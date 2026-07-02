import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { chatWithAI } from '@/lib/aiService'

/**
 * AIAssistant - Floating SIARM chatbot widget.
 *
 * Uses the demo-aware aiService (chatWithAI) so it works during the defense
 * without an API key, and transparently upgrades to the backend proxy in
 * production. Rendered globally; only visible when a user is signed in.
 *
 * Light (day) theme only — no dark styling anywhere.
 */
export default function AIAssistant() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hello! I'm the SIARM AI Assistant. I can help you with attendance, grades, timetables, fees, exams, and campus information. What would you like to know?",
    },
  ])
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  // Hide the assistant on public/unauthenticated screens.
  if (!user) return null

  const send = async (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')
    setSending(true)

    try {
      const reply = await chatWithAI(text, user.role || 'student', {
        name: user.name,
        campus: user.campus,
      })
      setMessages((m) => [...m, { from: 'bot', text: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: "Sorry, I couldn't process that. Please try again." },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-soft transition hover:bg-brand-800"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft">
          {/* Header */}
          <div className="flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">SIARM Assistant</p>
              <p className="text-[11px] text-white/80">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-brand-700 text-white'
                      : 'rounded-bl-sm border border-ink-200 bg-white text-ink-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-500">
                  <Loader2 size={14} className="animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex items-center gap-2 border-t border-ink-200 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about grades, fees, exams…"
              className="flex-1 rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white transition hover:bg-brand-800 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
