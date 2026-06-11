import { useContext } from 'react'
import { ThemeContext } from '../../features/theme/ThemeContext.jsx'
import { Sun, Moon } from 'lucide-react'

// Component Nút Chuyển Đổi Giao Diện Sáng/Tối (Light/Dark Mode)
export function ThemeToggle() {
  // Lấy trạng thái theme (dark/light) và hàm toggle từ ThemeContext
  const { theme, toggle } = useContext(ThemeContext)

  return (
    // Nút nổi (fixed) luôn hiển thị ở góc dưới cùng bên phải màn hình (bottom-6 right-6)
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
      title="Chuyển đổi giao diện"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-white text-gray-800 dark:bg-gray-800 dark:text-yellow-300 transition-colors"
    >
      {/* Hiển thị icon Sun (Mặt trời) nếu đang ở chế độ tối, ngược lại hiển thị icon Moon (Mặt trăng) */}
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
