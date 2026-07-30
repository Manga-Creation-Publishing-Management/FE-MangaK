import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@/features/theme/ThemeContext.jsx';
import { ToastProvider } from '@/shared/hooks/useToast.jsx';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
