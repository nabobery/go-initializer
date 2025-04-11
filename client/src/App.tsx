import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { useThemeMode } from './hooks/useThemeMode';

function App() {
    const { theme, themeMode, toggleThemeMode } = useThemeMode();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Ensures consistent baseline styling */}
            <Router>
                {/* Flex container to manage layout */}
                <div className="flex flex-col min-h-screen"> {/* Use flex column, ensure min height of viewport */}
                    <Header themeMode={themeMode} toggleThemeMode={toggleThemeMode} />

                    {/* Main content area */}
                    {/* flex-grow allows this element to take up available space */}
                    {/* Removed padding from here, let HomePage handle its own padding */}
                    {/* Added background color here for consistency across pages */}
                    <main className="flex-grow w-full bg-gray-100 dark:bg-gray-900"> {/* Ensure main area takes remaining space and has the background */}
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            {/* Add other routes here if needed */}
                        </Routes>
                    </main>

                    <Footer /> {/* Footer will be pushed to the bottom */}
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;