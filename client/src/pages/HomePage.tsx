import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import {
  ChevronRightIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
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
  const { goVersion } = useConfigStore();

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
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Go Project Initializer
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Configure your Go project with modern frameworks and features.
            <a
              href={`https://go.dev/doc/devel/release#go${goVersion}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
              title={`View Go ${goVersion} release notes`}
            >
              Go Version: {goVersion}
              <ChevronRightIcon className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Configuration Options */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
              <div className="p-6 space-y-6">
                <MetadataInput />
                <hr className="border-gray-100 dark:border-dark-border" />
                <FrameworkSelector />
                <hr className="border-gray-100 dark:border-dark-border" />
                <DatabaseSelector />
                <hr className="border-gray-100 dark:border-dark-border" />
                <FeatureSelector />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Preview & Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                {/* Code Preview Area */}
                <div className="flex-grow bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 min-h-[300px] border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-32">
                    Project structure preview will appear here
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <motion.button
                    onClick={handlePreview}
                    disabled={isLoadingDownload}
                    className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Preview Code
                  </motion.button>

                  <motion.button
                    onClick={handleDownload}
                    disabled={isLoadingDownload}
                    className="flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                      <>
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Generate & Download
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg"
                      role="alert"
                    >
                      <p className="font-medium mb-1">Error</p>
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
