import { Languages } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

/**
 * Two-segment toggle that always shows both languages.
 * The currently-active one is filled; clicking the other switches.
 * Compact, accessible, and unambiguous.
 */
export default function LangToggle({ compact = false }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`inline-flex items-center bg-ink-100 dark:bg-ink-800 rounded-xl p-1 ${compact ? '' : 'gap-0.5'}`} role="radiogroup" aria-label="Language">
      <button
        type="button"
        role="radio"
        aria-checked={lang === 'en'}
        onClick={() => setLang('en')}
        title="English"
        className={`relative px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
          lang === 'en'
            ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-700 dark:text-white'
            : 'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={lang === 'fr'}
        onClick={() => setLang('fr')}
        title="Français"
        className={`relative px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
          lang === 'fr'
            ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-700 dark:text-white'
            : 'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200'
        }`}
      >
        FR
      </button>
      {!compact && <Languages size={14} className="text-ink-400 ml-1 mr-1" />}
    </div>
  )
}
