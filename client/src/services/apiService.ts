import axios from "axios";
import { useConfigStore } from "../store/useConfigStore"; // To get the full state shape if needed

// Define the expected configuration shape based on Zustand store
type ProjectConfig = Omit<
  ReturnType<typeof useConfigStore.getState>,
  | "setFramework"
  | "setDatabase"
  | "toggleFeature"
  | "setModulePath"
  | "setProjectName"
  | "setDbConfig"
  | "toggleThemeMode"
  | "resetConfig"
  | "themeMode"
>;

// Determine API base URL based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"; // Use env var or default

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  responseType: "blob", // Important for file downloads!
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateProjectZip = async (
  config: ProjectConfig
): Promise<Blob> => {
  try {
    // Make sure features is always an array
    const payload = { ...config, features: config.features || [] };
    console.log("Sending payload to /generate:", payload);

    const response = await apiClient.post("/generate", payload);

    // Check if the response looks like a zip file (blob)
    if (
      response.data instanceof Blob &&
      response.data.type === "application/zip"
    ) {
      return response.data;
    } else {
      // If the backend sent a JSON error instead of a blob
      try {
        const errorText = await response.data.text(); // Try reading blob as text
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Invalid response from server.");
      } catch {
        throw new Error("Received unexpected response format from server.");
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      // Attempt to parse error message from blob if API returns error as blob with JSON content
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        console.error("API Error:", errorJson);
        throw new Error(errorJson.message || "Failed to generate project.");
      } catch (parseError) {
        console.error("Failed to parse error blob:", parseError);
        throw new Error("An unknown error occurred during generation.");
      }
    } else if (error instanceof Error) {
      console.error("API Error:", error);
      throw error; // Re-throw known errors
    } else {
      console.error("Unknown API Error:", error);
      throw new Error("An unknown error occurred.");
    }
  }
};
