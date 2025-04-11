import { useMemo } from 'react';
 import { createTheme } from '@mui/material/styles';
 import { useConfigStore } from '../store/useConfigStore';
 import { getDesignTokens } from '../styles/theme';

 export const useThemeMode = () => {
     const themeMode = useConfigStore((state) => state.themeMode);
     const toggleThemeMode = useConfigStore((state) => state.toggleThemeMode);

     // Update the theme only if the mode changes
     const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);

     return { theme, themeMode, toggleThemeMode };
 };