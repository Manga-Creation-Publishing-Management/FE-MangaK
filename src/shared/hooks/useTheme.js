import { useContext } from 'react';
import { ThemeContext } from '@/features/auth/ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
}
