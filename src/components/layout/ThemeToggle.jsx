import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

/**
 * ThemeToggle - Day/Dark mode toggle for navbar
 * For defense: Light mode only, but extensible for future dark mode
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-ink-100 rounded-lg transition duration-200 text-ink-600 hover:text-ink-900"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  )
}
