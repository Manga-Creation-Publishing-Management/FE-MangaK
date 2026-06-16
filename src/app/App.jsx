import '../styles/global.css';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from '../routes/AppRoutes';
import { ThemeProvider } from '../features/theme/ThemeContext.jsx'
import { ThemeToggle } from '../shared/components/ThemeToggle.jsx'

// Component App: Lớp vỏ ngoài cùng, thiết lập các Provider toàn cục (Global Context)
export default function App() {
  return (
    // ThemeProvider: Quản lý trạng thái Light/Dark mode cho toàn app
    <ThemeProvider>
      {/* BrowserRouter: Quản lý bộ định tuyến (URL) cho toàn bộ ứng dụng (SPA) */}
      <BrowserRouter>
        {/* AppRoutes: Nơi định nghĩa và chứa toàn bộ logic chuyển trang (các <Route>) */}
        <AppRoutes/>
      </BrowserRouter>
      
      {/* Nút chuyển đổi Light/Dark mode luôn hiển thị ở góc màn hình */}
      <ThemeToggle />
    </ThemeProvider>
  )
}
