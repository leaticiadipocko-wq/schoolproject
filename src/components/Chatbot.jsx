import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const SIARM_CONTEXT = `You are SIARM AI Assistant — a helpful chatbot for the Smart Institution Academic Resource Management system at IUGET Bonabéri (Institut Universitaire du Golfe de Guinée) in Douala, Cameroon.

You help users with:
- Navigating the SIARM platform
- Understanding features (attendance, grades, timetable, fees, assignments, discussions, etc.)
- Answering questions about IUGET university
- Providing academic guidance
- Troubleshooting common issues
- Explaining how to use different modules

Key facts about SIARM:
- It's a unified educational platform for students, lecturers, staff, and administrators
- Features include: attendance tracking, grade management, timetable scheduling, fee payments (MoMo/OM/Visa/bank), mobile learning, discussions, announcements, ID cards, transcripts, analytics, and more
- Available in English and French
- Works offline as a PWA
- Built with React, Tailwind CSS, and Firebase

Be concise, friendly, and helpful. If you don't know something specific, suggest they contact the admin or check the Help page.`

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I\'m the SIARM AI Assistant. How can I help you today? I can assist with navigating the platform, understanding features, or answering questions about IUGET.',
  },
]

const SUGGESTIONS_EN = [
  'How do I check my attendance?',
  'How to pay tuition fees?',
  'How to view my grades?',
  'How to use the timetable?',
]

const SUGGESTIONS_FR = [
  'Comment vérifier mes présences ?',
  'Comment payer les frais ?',
  'Comment voir mes notes ?',
  'Comment utiliser l\'emploi du temps ?',
]

export default function Chatbot() {
  const { t, lang } = useLang()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = async (messageText) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      if (apiKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SIARM_CONTEXT + `\n\nUser role: ${user?.role || 'guest'}\nPreferred language: ${lang === 'fr' ? 'French' : 'English'}`,
            messages: [...messages.filter((m) => m.id !== 'welcome'), userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        const data = await response.json()
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content?.[0]?.text || getFallbackResponse(text),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800))
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getFallbackResponse(text),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: lang === 'fr'
          ? 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer ou contacter l\'administration.'
          : 'Sorry, I encountered an error. Please try again or contact the admin.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackResponse = (query) => {
    const q = query.toLowerCase()

    const responses = {
      attendance: {
        en: 'To check your attendance:\n1. Go to **Dashboard** → **Attendance** from the sidebar\n2. You\'ll see attendance records for each course with percentages\n3. Green means present, red means absent\n\nTip: Maintain above 75% attendance to be eligible for exams.',
        fr: 'Pour vérifier vos présences :\n1. Allez au **Tableau de bord** → **Présences** dans le menu\n2. Vous verrez les enregistrements par cours avec les pourcentages\n3. Vert = présent, Rouge = absent\n\nConseil : Maintenez une présence supérieure à 75% pour être admissible aux examens.',
      },
      fees: {
        en: 'To pay tuition fees:\n1. Go to **Fees** from the sidebar\n2. View your fee structure and outstanding balance\n3. Click **Pay Now** and choose your method:\n   - Mobile Money (MTN MoMo, Orange Money)\n   - Visa/Mastercard\n   - Bank transfer\n\nPayments are processed instantly for MoMo/OM.',
        fr: 'Pour payer les frais de scolarité :\n1. Allez à **Scolarité** dans le menu\n2. Consultez la structure des frais et le solde dû\n3. Cliquez sur **Payer** et choisissez votre méthode :\n   - Mobile Money (MTN MoMo, Orange Money)\n   - Visa/Mastercard\n   - Virement bancaire\n\nLes paiements MoMo/OM sont instantanés.',
      },
      grades: {
        en: 'To view your grades:\n1. Go to **Results** from the sidebar\n2. Select semester and academic year\n3. See CA (Continuous Assessment) + Exam grades\n4. Download your transcript as PDF\n\nYour GPA is calculated automatically.',
        fr: 'Pour voir vos notes :\n1. Allez à **Résultats** dans le menu\n2. Sélectionnez le semestre et l\'année académique\n3. Consultez les notes de CC + Examens\n4. Téléchargez votre relevé de notes en PDF\n\nVotre moyenne est calculée automatiquement.',
      },
      timetable: {
        en: 'To use the timetable:\n1. Go to **Timetable** from the sidebar\n2. View your weekly schedule in a grid format\n3. Filter by specialty or track if needed\n4. Export to your calendar (.ics file)\n\nLecturers can build timetables from the Staff panel.',
        fr: 'Pour utiliser l\'emploi du temps :\n1. Allez à **Emploi du temps** dans le menu\n2. Consultez votre horaire hebdomadaire\n3. Filtrez par spécialité si nécessaire\n4. Exportez vers votre calendrier (fichier .ics)\n\nLes enseignants peuvent créer des emplois du temps depuis le panneau Personnel.',
      },
      assignment: {
        en: 'To manage assignments:\n1. Go to **Assignments** from the sidebar\n2. View pending assignments with deadlines\n3. Click an assignment to submit your work\n4. See grades and feedback after grading\n\nYou can upload files or type your response directly.',
        fr: 'Pour gérer les devoirs :\n1. Allez à **Devoirs** dans le menu\n2. Consultez les devoirs en cours avec les dates limites\n3. Cliquez sur un devoir pour soumettre votre travail\n4. Consultez les notes et commentaires après évaluation\n\nVous pouvez télécharger des fichiers ou taper votre réponse directement.',
      },
      discussion: {
        en: 'To participate in discussions:\n1. Go to **Discussions** from the sidebar\n2. Select a course to view its thread\n3. Post new messages or reply to existing ones\n4. Discussions are course-specific and moderated\n\nGreat for asking questions and collaborating!',
        fr: 'Pour participer aux discussions :\n1. Allez à **Discussions** dans le menu\n2. Sélectionnez un cours pour voir son fil\n3. Publiez de nouveaux messages ou répondez aux existants\n4. Les discussions sont spécifiques à chaque cours\n\nIdéal pour poser des questions et collaborer !',
      },
      id: {
        en: 'To get your student ID card:\n1. Go to **ID Card** from the sidebar\n2. View your digital ID with QR code\n3. Click **Print** to get a physical copy\n4. The QR code can be scanned for verification\n\nYour ID is valid for the current academic year.',
        fr: 'Pour obtenir votre carte étudiant :\n1. Allez à **Carte étudiant** dans le menu\n2. Consultez votre carte numérique avec code QR\n3. Cliquez sur **Imprimer** pour une copie physique\n4. Le code QR peut être scanné pour vérification\n\nVotre carte est valable pour l\'année académique en cours.',
      },
    }

    let matchedKey = null
    if (q.includes('attend') || q.includes('présence') || q.includes('present')) matchedKey = 'attendance'
    else if (q.includes('fee') || q.includes('pay') || q.includes('tuition') || q.includes('scolarité') || q.includes('payer') || q.includes('frais')) matchedKey = 'fees'
    else if (q.includes('grade') || q.includes('result') || q.includes('note') || q.includes('résultat') || q.includes('gpa') || q.includes('moyenne')) matchedKey = 'grades'
    else if (q.includes('timetable') || q.includes('schedule') || q.includes('emploi') || q.includes('horaire') || q.includes('class')) matchedKey = 'timetable'
    else if (q.includes('assignment') || q.includes('homework') || q.includes('devoir') || q.includes('submit')) matchedKey = 'assignment'
    else if (q.includes('discuss') || q.includes('forum') || q.includes('message') || q.includes('chat')) matchedKey = 'discussion'
    else if (q.includes('id') || q.includes('card') || q.includes('carte') || q.includes('identity')) matchedKey = 'id'

    if (matchedKey && responses[matchedKey]) {
      return responses[matchedKey][lang] || responses[matchedKey].en
    }

    return lang === 'fr'
      ? 'Je peux vous aider avec :\n• Vérifier vos présences\n• Payer les frais de scolarité\n• Consulter vos notes\n• Utiliser l\'emploi du temps\n• Gérer les devoirs\n• Participer aux discussions\n• Obtenir votre carte étudiant\n\nPosez-moi une question spécifique !'
      : 'I can help you with:\n• Checking attendance\n• Paying tuition fees\n• Viewing grades\n• Using the timetable\n• Managing assignments\n• Participating in discussions\n• Getting your student ID card\n\nAsk me a specific question!'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = lang === 'fr' ? SUGGESTIONS_FR : SUGGESTIONS_EN

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            title={t('chatbot.title')}
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-200 dark:border-ink-700 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-brand-600 to-accent-600 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{t('chatbot.title')}</h3>
                <p className="text-white/80 text-xs">{t('chatbot.subtitle')}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === 'user'
                        ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300'
                        : 'bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-300'
                    }`}
                  >
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-md'
                        : 'bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-100 rounded-tl-md'
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                        {line.split('**').map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-300 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-ink-100 dark:bg-ink-800 rounded-2xl rounded-tl-md px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-ink-400" />
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-ink-500 dark:text-ink-400 text-center">
                    {t('chatbot.suggestions')}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-ink-200 dark:border-ink-700 p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
