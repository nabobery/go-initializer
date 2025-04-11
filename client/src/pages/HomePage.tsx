import { useState } from "react";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import FrameworkSelector from "../components/ConfigForm/FrameworkSelector";
import DatabaseSelector from "../components/ConfigForm/DatabaseSelector";
import FeatureSelector from "../components/ConfigForm/FeatureSelector";
import MetadataInput from "../components/ConfigForm/MetadataInput";
import { useConfigStore } from "../store/useConfigStore";
import { generateProjectZip } from "../services/apiService";

function HomePage() {
  const config = useConfigStore((state) => ({
    framework: state.framework,
    database: state.database,
    features: state.features,
    modulePath: state.modulePath,
    projectName: state.projectName,
    goVersion: state.goVersion,
    dbConfig: state.dbConfig,
  }));
  const { projectName, goVersion } = useConfigStore();

  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoadingDownload(true);
    setError(null);
    try {
      if (
        !config.modulePath ||
        !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*$/.test(
          config.modulePath
        )
      ) {
        throw new Error(
          "Invalid Go module path format (e.g., github.com/user/repo)."
        );
      }
      if (!config.framework) {
        throw new Error("Please select a web framework.");
      }

      console.log("Sending payload to /generate:", config);
      const blob = await generateProjectZip(config);
      saveAs(blob, `${config.projectName || "go-project"}.zip`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during download.";
      console.error("Download failed:", message);
      setError(message);
    } finally {
      setIsLoadingDownload(false);
    }
  };

  const handlePreview = () => {
    console.log("Previewing with config:", config);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configure your Go Project
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Go Version: {goVersion} (Latest Stable)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Configuration Options */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 space-y-6">
              <MetadataInput />
              <FrameworkSelector />
              <DatabaseSelector />
              <FeatureSelector />
            </div>
          </div>

          {/* Right Side: Preview & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 h-full flex flex-col">
              {/* Code Preview Area */}
              <div className="flex-grow border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6 min-h-[300px]">
                <p className="text-gray-500 dark:text-gray-400">
                  Code Preview Area (Implement Later)
                </p>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePreview}
                  disabled={isLoadingDownload}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Preview Code
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isLoadingDownload}
                  className="relative px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoadingDownload ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate & Download .ZIP"
                  )}
                </button>
              </div>

              {error && (
                <div
                  className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
                  role="alert"
                >
                  <p className="font-bold">Error:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
