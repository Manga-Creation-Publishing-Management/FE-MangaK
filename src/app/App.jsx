import '../styles/global.css';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from '../routes/AppRoutes';
import { ThemeProvider } from '../features/theme/ThemeContext.jsx'
import { ToastProvider } from '../shared/hooks/useToast.jsx';

// Component App: Lớp vỏ ngoài cùng, thiết lập các Provider toàn cục (Global Context)
export default function App() {
  return (
    // ThemeProvider: Quản lý trạng thái Light/Dark mode cho toàn app
    <ThemeProvider>
      {/* ToastProvdier để gọi hooks hiện thông báo*/}
      <ToastProvider>
        {/* BrowserRouter: Quản lý bộ định tuyến (URL) cho toàn bộ ứng dụng (SPA) */}
        <BrowserRouter>
          {/* AppRoutes: Nơi định nghĩa và chứa toàn bộ logic chuyển trang (các <Route>) */}
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider >
  )
}
