import { useContext } from 'react'
import { ThemeContext } from '../../features/theme/ThemeContext.jsx'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext)

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
      title="Chuyển đổi giao diện"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-white text-gray-800 dark:bg-gray-800 dark:text-yellow-300 transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
