import { useConfigStore } from "../../store/useConfigStore";
import { motion } from "framer-motion";
import { CubeIcon } from "@heroicons/react/24/outline";

function FrameworkSelector() {
  const framework = useConfigStore((state) => state.framework);
  const setFramework = useConfigStore((state) => state.setFramework);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFramework(event.target.value as "gin" | "echo");
  };

  const options = [
    {
      value: "gin",
      label: "Gin",
      description:
        "High-performance HTTP web framework with excellent middleware support",
      features: [
        "Fast HTTP router",
        "Middleware support",
        "JSON validation",
        "Route grouping",
      ],
    },
    {
      value: "echo",
      label: "Echo",
      description: "High performance, extensible, minimalist web framework",
      features: [
        "Optimized router",
        "Data binding",
        "Middleware",
        "Static files",
      ],
    },
    {
      value: "chi",
      label: "Chi",
      description: "Lightweight, idiomatic and composable router for Go HTTP services",
      features: [
        "Standard library compatible",
        "Context control",
        "Extensive middleware collection",
        "Graceful shutdown",
      ],
    },
  ];

  return (
    <div className="space-y-4" id="framework-selector">
      <div className="flex items-center gap-2">
        <CubeIcon className="w-5 h-5 text-primary-500" />
        <label className="block text-base font-medium text-gray-900 dark:text-white">
          Web Framework
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.label
            key={option.value}
            className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-colors ${
              framework === option.value
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  value={option.value}
                  checked={framework === option.value}
                  onChange={handleChange}
                  name="framework"
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
                />
              </div>
              <div className="ml-3">
                <span className="block text-base font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </span>
              </div>
            </div>

            <motion.ul
              className="mt-4 ml-7 space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: framework === option.value ? 1 : 0.5 }}
            >
              {option.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-300 list-disc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

export default FrameworkSelector;
