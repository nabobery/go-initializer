import { motion } from "framer-motion";
import FrameworkSelector from "../components/ConfigForm/FrameworkSelector";
import DatabaseSelector from "../components/ConfigForm/DatabaseSelector";
import FeatureSelector from "../components/ConfigForm/FeatureSelector";
import MetadataInput from "../components/ConfigForm/MetadataInput";
import { useConfigStore } from "../store/useConfigStore";
// Import API service and download logic in Phase 4
// Import Preview component in Phase 6

function HomePage() {
  const config = useConfigStore((state) => state); // Get all state for sending to backend
  const { goVersion } = useConfigStore(); // Get specific ones for display/buttons
  // Add loading/error state for API calls later

  const handleDownload = () => {
    console.log("Downloading with config:", config);
    // TODO: Call backend API in Phase 4
  };

  const handlePreview = () => {
    console.log("Previewing with config:", config);
    // TODO: Call backend API in Phase 6
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
                  Code Preview Area
                </p>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Preview Code
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Generate & Download .ZIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
