import '@/styles/global.css';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@/features/theme/ThemeContext.jsx'
import { ToastProvider } from '@/shared/hooks/useToast.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider >
  )
}
