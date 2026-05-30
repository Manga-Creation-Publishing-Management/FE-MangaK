import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@/features/auth/ThemeContext';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
