import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import {
  ChevronRightIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import FrameworkSelector from "../components/ConfigForm/FrameworkSelector";
import DatabaseSelector from "../components/ConfigForm/DatabaseSelector";
import FeatureSelector from "../components/ConfigForm/FeatureSelector";
import MetadataInput from "../components/ConfigForm/MetadataInput";
import { useConfigStore } from "../store/useConfigStore";
import {
  generateProjectZip,
  getProjectPreview,
  ProjectPreview,
} from "../services/apiService";
import PreviewModal from "../components/PreviewModal";
import AppTour from "../components/Tour/AppTour";

type DbConfig = Record<string, unknown>;

function HomePage() {
  const config = useConfigStore((state) => ({
    framework: state.framework,
    database: state.database,
    features: state.features,
    modulePath: state.modulePath,
    projectName: state.projectName,
    goVersion: state.goVersion,
    dbConfig: state.dbConfig as DbConfig,
  }));
  const { goVersion, projectName } = useConfigStore();

  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview state
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ProjectPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tour state
  const [isTourRunning, setIsTourRunning] = useState(false);
  const startTour = () => setIsTourRunning(true);
  const handleTourComplete = () => setIsTourRunning(false);

  const handleDownload = useCallback(async () => {
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
  }, [config]);

  const handleOpenPreview = useCallback(async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    setPreviewData(null);
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
      const data = await getProjectPreview(config);
      setPreviewData(data);
      setIsModalOpen(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during preview.";
      setPreviewError(message);
      setError(message);
    } finally {
      setIsLoadingPreview(false);
    }
  }, [config]);

  const handleClosePreview = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* App Tour */}
      <AppTour run={isTourRunning} onTourComplete={handleTourComplete} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center relative">
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
          {/* Tour Help Button */}
          <button
            onClick={startTour}
            className="absolute top-0 right-0 mt-2 mr-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 z-20"
            title="Take a guided tour"
            id="tour-help-button"
            type="button"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Tour</span>
          </button>
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

          {/* Right Side: Actions (Preview button now opens modal) */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
              <div className="p-6 h-full flex flex-col justify-center">
                <div className="text-center mb-8">
                  <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    Ready to Generate?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure your project on the left, then preview or
                    download.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-auto">
                  <motion.button
                    id="preview-button"
                    onClick={handleOpenPreview}
                    disabled={isLoadingDownload || isLoadingPreview}
                    className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoadingPreview ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5"
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
                        Loading...
                      </>
                    ) : (
                      <>
                        <EyeIcon className="w-5 h-5 mr-2" />
                        Preview Code
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    id="download-button"
                    onClick={handleDownload}
                    disabled={isLoadingDownload || isLoadingPreview}
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
                  {(error || previewError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm text-center"
                      role="alert"
                    >
                      {error || previewError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isModalOpen}
        onRequestClose={handleClosePreview}
        previewData={previewData}
        isLoading={isLoadingPreview}
        error={previewError}
        projectName={projectName || config.modulePath?.split("/").pop()}
      />
    </div>
  );
}

export default HomePage;
