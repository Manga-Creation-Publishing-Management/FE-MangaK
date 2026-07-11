import { useContext } from 'react'
import { ThemeContext } from '@/features/theme/ThemeContext.jsx'
import { Sun, Moon } from 'lucide-react'

// Component Nút Chuyển Đổi Giao Diện Sáng/Tối (Light/Dark Mode)
export function ThemeToggle() {
  // Lấy trạng thái theme (dark/light) và hàm toggle từ ThemeContext
  const { theme, toggle } = useContext(ThemeContext)

  return (
    // Nút hiển thị trong header
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
      title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="flex text-muted-foreground hover:text-accent hover:rounded p-2 transition-colors"
    >
      {/* Hiển thị icon Sun (Mặt trời) nếu đang ở chế độ tối, ngược lại hiển thị icon Moon (Mặt trăng) */}
      <div className="content-center">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </div>
    </button>
  )
}
