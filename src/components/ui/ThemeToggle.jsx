import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle flex items-center justify-center w-9 h-9 p-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer"
    >
      {isDark ? (
        <Sun size={18} color="var(--muted)" />
      ) : (
        <Moon size={18} color="var(--muted)" />
      )}
    </button>
  )
}