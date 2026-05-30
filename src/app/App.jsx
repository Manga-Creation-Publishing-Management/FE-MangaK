
import '../styles/global.css'
import { BrowserRouter } from 'react-router';
import { AppRoutes } from '../routes/AppRoutes';
import { ThemeProvider } from '../features/theme/ThemeContext.jsx'
import { ThemeToggle } from '../shared/components/ThemeToggle.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
      <ThemeToggle />
    </ThemeProvider>
  )
}
