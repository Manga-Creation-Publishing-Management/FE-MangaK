import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'light',   
  toggle: () => {}, 
})

export function ThemeProvider({ children }) {
  
  const [theme, setTheme] = useState(() => {
    
    if (typeof window === 'undefined') return 'light'
    
    const saved = window.localStorage.getItem('mangak-theme')
    if (saved === 'dark' || saved === 'light') return saved
    
    return 'light'
  })

  useEffect(() => {
    
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    window.localStorage.setItem('mangak-theme', theme)
  }, [theme])

  const toggle = () => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.add('theme-transitioning');
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 220);
    }
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
