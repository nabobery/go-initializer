import React from 'react';

interface ThemeToggleButtonProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme, currentTheme }) => {
  return (
    <button onClick={toggleTheme}>
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggleButton;