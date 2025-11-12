import { create } from "zustand";
import { persist } from "zustand/middleware"; // Optional: to persist state
import { getAllVersions, VersionsResponse } from "../services/apiService";

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
  framework: "gin" | "echo" | "chi" | "";
  database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | "";
  features: ("logrus" | "zap" | "testify")[];
  modulePath: string;
  projectName: string;
  goVersion: string;
  frameworkVersion: string;
  databaseVersion: string;
  gormVersion: string;
  logrusVersion: string;
  zapVersion: string;
  testifyVersion: string;
  viperVersion: string;
  dbConfig: DbConfig;

  // Available versions from backend
  availableVersions: VersionsResponse | null;
  versionsLoading: boolean;
  versionsError: string | null;

  // UI State
  themeMode: "light" | "dark";

  // Actions
  setFramework: (framework: "gin" | "echo" | "chi") => void;
  setDatabase: (
    database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | ""
  ) => void;
  toggleFeature: (feature: "logrus" | "zap" | "testify") => void;
  setModulePath: (path: string) => void;
  setProjectName: (name: string) => void;
  setDbConfig: (config: Partial<DbConfig>) => void;
  setGoVersion: (version: string) => void;
  setFrameworkVersion: (version: string) => void;
  setDatabaseVersion: (version: string) => void;
  setGormVersion: (version: string) => void;
  setFeatureVersion: (feature: string, version: string) => void;
  toggleThemeMode: () => void;
  resetConfig: () => void;
  fetchVersions: () => Promise<void>;
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
  | "setGoVersion"
  | "setFrameworkVersion"
  | "setDatabaseVersion"
  | "setGormVersion"
  | "setFeatureVersion"
  | "toggleThemeMode"
  | "resetConfig"
  | "fetchVersions"
>;

// Explicitly type initialState
const initialState: InitialStateType = {
  framework: "gin", // Default selection
  database: "none",
  features: [],
  modulePath: "github.com/your-username/your-project",
  projectName: "your-project",
  goVersion: "1.24.1",
  frameworkVersion: "",
  databaseVersion: "",
  gormVersion: "",
  logrusVersion: "",
  zapVersion: "",
  testifyVersion: "",
  viperVersion: "",
  dbConfig: initialDbConfig,
  availableVersions: null,
  versionsLoading: false,
  versionsError: null,
  themeMode: "light",
};

// Using persist middleware to save theme choice to local storage
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      ...initialState, // Now initialState has explicit, precise types
      setFramework: (framework) => {
        const state = get();
        const newFrameworkVersion =
          state.availableVersions?.frameworks[framework]?.default || "";
        set({ framework, frameworkVersion: newFrameworkVersion });
      },
      setDatabase: (database) => {
        const state = get();
        const projectName = state.projectName;
        let defaultDbConfig;
        let newDatabaseVersion = "";
        let newGormVersion = "";

        // Set database version from available versions
        if (state.availableVersions && database && database !== "none") {
          newDatabaseVersion =
            state.availableVersions.databases[database]?.default || "";
          if (["postgres", "mysql", "sqlite"].includes(database)) {
            newGormVersion =
              state.availableVersions.databases.gorm?.default || "";
          }
        }

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
          case "none":
            defaultDbConfig = initialDbConfig;
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
        set({
          database,
          dbConfig: defaultDbConfig,
          databaseVersion: newDatabaseVersion,
          gormVersion: newGormVersion,
        });
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
      setGoVersion: (goVersion) => set({ goVersion }),
      setFrameworkVersion: (frameworkVersion) => set({ frameworkVersion }),
      setDatabaseVersion: (databaseVersion) => set({ databaseVersion }),
      setGormVersion: (gormVersion) => set({ gormVersion }),
      setFeatureVersion: (feature, version) => {
        const versionKey = `${feature}Version` as keyof ConfigState;
        set({ [versionKey]: version } as Partial<ConfigState>);
      },
      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
      resetConfig: () =>
        set({
          ...initialState,
          themeMode: get().themeMode,
          availableVersions: get().availableVersions,
          dbConfig: initialDbConfig,
        }),
      fetchVersions: async () => {
        set({ versionsLoading: true, versionsError: null });
        try {
          const versions = await getAllVersions();
          set({
            availableVersions: versions,
            versionsLoading: false,
            goVersion: versions.go.default,
            frameworkVersion: versions.frameworks.gin?.default || "",
            viperVersion: versions.features.viper?.default || "",
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load versions";
          set({
            versionsError: errorMessage,
            versionsLoading: false,
          });
        }
      },
    }),
    {
      name: "go-initializer-storage", // name of item in storage
      partialize: (state) => ({ themeMode: state.themeMode }), // Only persist themeMode
    }
  )
);
