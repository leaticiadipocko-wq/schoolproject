import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

/**
 * Two-segment toggle that shows both Day and Night themes.
 * Currently active theme is highlighted; clicking the other switches.
 * Matches LangToggle design pattern for consistency.
 * Defense: Light theme optimized for presentations.
 */
export default function ThemeToggle({ compact = false }) {
  const { theme, setLightTheme, setDarkTheme } = useTheme()
  
  return (
    <div 
      className={`inline-flex items-center bg-ink-100 dark:bg-ink-800 rounded-xl p-1 ${compact ? '' : 'gap-0.5'}`} 
      role="radiogroup" 
      aria-label="Theme"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={setLightTheme}
        title="Light Theme"
        className={`relative px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
          theme === 'light'
            ? 'bg-white text-amber-600 shadow-soft dark:bg-ink-700 dark:text-amber-300'
            : 'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200'
        }`}
      >
        <Sun size={14} strokeWidth={2.5} />
        Day
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={setDarkTheme}
        title="Dark Theme"
        className={`relative px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
          theme === 'dark'
            ? 'bg-white text-slate-700 shadow-soft dark:bg-ink-700 dark:text-slate-300'
            : 'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200'
        }`}
      >
        <Moon size={14} strokeWidth={2.5} />
        Night
      </button>
    </div>
  )
}
