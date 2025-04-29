import { useConfigStore } from "../../store/useConfigStore";
import { motion } from "framer-motion";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";

type FeatureOption = "logrus" | "zap" | "testify";

interface Feature {
  id: FeatureOption;
  name: string;
  description: string;
  icon: string;
}

function FeatureSelector() {
  const features = useConfigStore((state) => state.features);
  const toggleFeature = useConfigStore((state) => state.toggleFeature);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleFeature(event.target.name as FeatureOption);
  };

  const featureOptions: Feature[] = [
    {
      id: "logrus",
      name: "Logrus Logger",
      description: "Structured logger for Go with hooks support",
      icon: "📝",
    },
    {
      id: "zap",
      name: "Zap Logger",
      description: "Blazing fast, structured logging in Go",
      icon: "⚡",
    },
    {
      id: "testify",
      name: "Testify",
      description: "Modern testing toolkit with assertions and mocks",
      icon: "🧪",
    },
  ];

  return (
    <div className="space-y-4" id="feature-selector">
      <div className="flex items-center gap-2">
        <PuzzlePieceIcon className="w-5 h-5 text-primary-500" />
        <label className="block text-base font-medium text-gray-900 dark:text-white">
          Optional Features
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureOptions.map((feature, index) => (
          <motion.label
            key={feature.id}
            className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-colors ${
              features.includes(feature.id)
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5 pt-1">
                <input
                  type="checkbox"
                  checked={features.includes(feature.id)}
                  onChange={handleChange}
                  name={feature.id}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl"
                    role="img"
                    aria-label={feature.name}
                  >
                    {feature.icon}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </span>
                </div>
                <motion.p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {feature.description}
                </motion.p>
              </div>
            </div>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

export default FeatureSelector;
