import { createContext, useEffect, useState } from 'react'

// Khởi tạo ThemeContext để chia sẻ trạng thái chế độ Sáng/Tối (Light/Dark mode)
export const ThemeContext = createContext({
  theme: 'light',   // Trạng thái mặc định là sáng
  toggle: () => {}, // Hàm đảo trạng thái mặc định (hàm rỗng)
})

// Provider bọc lấy các component con, giúp truyền dữ liệu theme từ trên xuống
export function ThemeProvider({ children }) {
  // State theme được khởi tạo một cách an toàn (lazy initialization)
  const [theme, setTheme] = useState(() => {
    // Nếu chạy trên môi trường SSR (Next.js) chưa có window thì fallback về light
    if (typeof window === 'undefined') return 'light'
    
    // Kiểm tra xem user đã từng tự lưu theme nào trong localStorage chưa
    const saved = window.localStorage.getItem('mangak-theme')
    if (saved === 'dark' || saved === 'light') return saved
    
    // Nếu chưa lưu, kiểm tra xem hệ điều hành của máy user đang để Dark mode không
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // useEffect này sẽ chạy mỗi khi state 'theme' thay đổi
  useEffect(() => {
    // Lấy ra thẻ root HTML cao nhất
    const root = document.documentElement
    
    // Nếu là dark mode thì thêm class 'dark' vào HTML (đây là cách TailwindCSS quản lý dark mode)
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Lưu lựa chọn mới vào localStorage để duy trì cho lần truy cập sau
    window.localStorage.setItem('mangak-theme', theme)
  }, [theme])

  // Hàm đảo ngược trạng thái theme (từ sáng thành tối, từ tối thành sáng)
  const toggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Render context provider và bọc toàn bộ ứng dụng bên trong (children)
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
