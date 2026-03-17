import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'var(--surface)'
      }}
    >
      {isDark ? (
        <Sun size={18} color="var(--muted)" />
      ) : (
        <Moon size={18} color="var(--muted)" />
      )}
    </button>
  )
}