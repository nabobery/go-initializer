import { create } from "zustand";
import { persist } from "zustand/middleware"; // Optional: to persist state

// Define the structure for dbConfig based on backend schema
interface DbConfig {
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  dbName?: string;
  uri?: string; // Primarily for MongoDB
}

interface ConfigState {
  // Go Project Config
  framework: "gin" | "echo" | "";
  database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | "";
  features: ("logrus" | "zap" | "testify")[];
  modulePath: string;
  projectName: string;
  goVersion: string; // Display only for now
  dbConfig: DbConfig;

  // UI State
  themeMode: "light" | "dark";

  // Actions
  setFramework: (framework: "gin" | "echo") => void;
  setDatabase: (
    database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | ""
  ) => void;
  toggleFeature: (feature: "logrus" | "zap" | "testify") => void;
  setModulePath: (path: string) => void;
  setProjectName: (name: string) => void;
  setDbConfig: (config: Partial<DbConfig>) => void;
  toggleThemeMode: () => void;
  resetConfig: () => void;
}

// Define initial state for dbConfig
const initialDbConfig: DbConfig = {
  host: "",
  port: "",
  user: "",
  password: "",
  dbName: "",
  uri: "",
};

// Define the type for the state properties by omitting actions from ConfigState
type InitialStateType = Omit<
  ConfigState,
  | "setFramework"
  | "setDatabase"
  | "toggleFeature"
  | "setModulePath"
  | "setProjectName"
  | "setDbConfig"
  | "toggleThemeMode"
  | "resetConfig"
>;

// Explicitly type initialState
const initialState: InitialStateType = {
  framework: "gin", // Default selection
  database: "none",
  features: [],
  modulePath: "github.com/your-username/your-project",
  projectName: "your-project",
  goVersion: "1.24.1", // Hardcoded for now, fetch dynamically later if needed
  dbConfig: initialDbConfig,
  themeMode: "light",
};

// Using persist middleware to save theme choice to local storage
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      ...initialState, // Now initialState has explicit, precise types
      setFramework: (framework) => set({ framework }),
      setDatabase: (database) => {
        const projectName = get().projectName;
        let defaultDbConfig;
        switch (database) {
          case "postgres":
            defaultDbConfig = {
              host: "localhost",
              port: "5432",
              user: "your_db_user",
              password: "your_db_password",
              dbName: `${projectName}_dev`,
              uri: "",
            };
            break;
          case "mysql":
            defaultDbConfig = {
              host: "localhost",
              port: "3306",
              user: "your_db_user",
              password: "your_db_password",
              dbName: `${projectName}_dev`,
              uri: "",
            };
            break;
          case "sqlite":
            // For SQLite, we use a file-based DB so we set a default DB_NAME and dummy values for the rest
            defaultDbConfig = {
              host: "localhost",
              port: "0",
              user: "none",
              password: "none",
              dbName: `${projectName}.db`,
              uri: "",
            };
            break;
          case "mongodb":
            defaultDbConfig = {
              host: "localhost:27017",
              port: "", // Not used when using full URI
              user: "your_db_user",
              password: "your_db_password",
              dbName: `${projectName}_dev`,
              uri: `mongodb://localhost:27017/${projectName}_dev`,
            };
            break;
          default:
            defaultDbConfig = {
              host: "localhost",
              port: "",
              user: "",
              password: "",
              dbName: "",
              uri: "",
            };
        }
        set({ database, dbConfig: defaultDbConfig });
      },
      toggleFeature: (feature) =>
        set((state) => ({
          features: state.features.includes(feature)
            ? state.features.filter((f) => f !== feature)
            : [...state.features, feature],
        })),
      setModulePath: (modulePath) => {
        const parts = modulePath.split("/");
        const projectName = parts.pop() || get().projectName; // Auto-update project name
        set({ modulePath, projectName });
      },
      setProjectName: (projectName) => set({ projectName }),
      setDbConfig: (configUpdate) =>
        set((state) => ({ dbConfig: { ...state.dbConfig, ...configUpdate } })),
      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
      resetConfig: () =>
        set({
          ...initialState,
          themeMode: get().themeMode,
          dbConfig: initialDbConfig,
        }),
    }),
    {
      name: "go-initializer-storage", // name of item in storage
      partialize: (state) => ({ themeMode: state.themeMode }), // Only persist themeMode
    }
  )
);
