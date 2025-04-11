import { useConfigStore } from "../../store/useConfigStore";

type FeatureOption = "logrus" | "zap" | "testify";

function FeatureSelector() {
  const features = useConfigStore((state) => state.features);
  const toggleFeature = useConfigStore((state) => state.toggleFeature);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleFeature(event.target.name as FeatureOption);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Optional Features
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={features.includes("logrus")}
            onChange={handleChange}
            name="logrus"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Logrus (Logger)
          </span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={features.includes("zap")}
            onChange={handleChange}
            name="zap"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Zap (Logger)
          </span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={features.includes("testify")}
            onChange={handleChange}
            name="testify"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Testify (Testing)
          </span>
        </label>
      </div>
    </div>
  );
}

export default FeatureSelector;
