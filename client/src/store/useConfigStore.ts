import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Optional: to persist state

interface ConfigState {
    // Go Project Config
    framework: 'gin' | 'echo' | '';
    database: 'postgres' | 'mysql' | 'sqlite' | 'mongodb' | 'none' | '';
    features: ('logrus' | 'zap' | 'testify')[];
    modulePath: string;
    projectName: string;
    goVersion: string; // Display only for now

    // UI State
    themeMode: 'light' | 'dark';

    // Actions
    setFramework: (framework: 'gin' | 'echo') => void;
    setDatabase: (database: 'postgres' | 'mysql' | 'sqlite' | 'mongodb' | 'none' | '') => void;
    toggleFeature: (feature: 'logrus' | 'zap' | 'testify') => void;
    setModulePath: (path: string) => void;
    setProjectName: (name: string) => void;
    toggleThemeMode: () => void;
    // Reset function might be useful
    resetConfig: () => void;
}

const initialState = {
    framework: 'gin', // Default selection
    database: 'none',
    features: [],
    modulePath: 'github.com/your-username/your-project',
    projectName: 'your-project',
    goVersion: '1.24.1', // Hardcoded for now, fetch dynamically later if needed
    themeMode: 'light',
};

// Using persist middleware to save theme choice to local storage
export const useConfigStore = create<ConfigState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setFramework: (framework) => set({ framework }),
            setDatabase: (database) => set({ database }),
            toggleFeature: (feature) =>
                set((state) => ({
                    features: state.features.includes(feature)
                        ? state.features.filter((f) => f !== feature)
                        : [...state.features, feature],
                })),
            setModulePath: (modulePath) => {
                const parts = modulePath.split('/');
                const projectName = parts.pop() || get().projectName; // Auto-update project name
                set({ modulePath, projectName });
            },
            setProjectName: (projectName) => set({ projectName }),
            toggleThemeMode: () =>
                set((state) => ({
                    themeMode: state.themeMode === 'light' ? 'dark' : 'light',
                })),
            resetConfig: () => set(initialState), // Reset doesn't reset theme
        }),
        {
            name: 'go-initializer-storage', // name of item in storage
            partialize: (state) => ({ themeMode: state.themeMode }), // Only persist themeMode
        }
    )
);