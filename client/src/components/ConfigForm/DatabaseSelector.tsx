import { useConfigStore } from "../../store/useConfigStore";
import { motion } from "framer-motion";
import { CubeIcon } from "@heroicons/react/24/outline";

type DatabaseOption = "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | "";

function DatabaseSelector() {
  const database = useConfigStore((state) => state.database);
  const setDatabase = useConfigStore((state) => state.setDatabase);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(event.target.value as DatabaseOption);
  };

  const options = [
    {
      value: "none",
      label: "None",
      description: "No database, perfect for simple APIs or static services",
      icon: "🚫",
    },
    {
      value: "postgres",
      label: "PostgreSQL (GORM)",
      description: "Powerful open-source relational database with GORM ORM",
      icon: "🐘",
    },
    {
      value: "mysql",
      label: "MySQL (GORM)",
      description: "Popular open-source relational database with GORM ORM",
      icon: "🐬",
    },
    {
      value: "sqlite",
      label: "SQLite (GORM)",
      description: "Lightweight, serverless relational database with GORM ORM",
      icon: "💾",
    },
    {
      value: "mongodb",
      label: "MongoDB (Driver)",
      description: "Flexible NoSQL document database with official Go driver",
      icon: "🍃",
    },
  ];

  return (
    <div className="space-y-4" id="database-selector">
      <div className="flex items-center gap-2">
        <CubeIcon className="w-5 h-5 text-primary-500" />
        <label className="block text-base font-medium text-gray-900 dark:text-white">
          Database
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <motion.label
            key={option.value}
            className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-colors ${
              database === option.value
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                value={option.value}
                checked={database === option.value}
                onChange={handleChange}
                name="database"
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
              />
            </div>
            <div className="ml-3 flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label={option.label}>
                  {option.icon}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
              </div>
              <motion.p
                className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {option.description}
              </motion.p>
            </div>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

export default DatabaseSelector;
