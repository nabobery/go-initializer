import { useConfigStore } from "../../store/useConfigStore";

type DatabaseOption = "postgres" | "mysql" | "sqlite" | "mongodb" | "none" | "";

function DatabaseSelector() {
  const database = useConfigStore((state) => state.database);
  const setDatabase = useConfigStore((state) => state.setDatabase);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(event.target.value as DatabaseOption);
  };

  const options = [
    { value: "none", label: "None" },
    { value: "postgres", label: "PostgreSQL (GORM)" },
    { value: "mysql", label: "MySQL (GORM)" },
    { value: "sqlite", label: "SQLite (GORM)" },
    { value: "mongodb", label: "MongoDB (Driver)" },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Database
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              value={option.value}
              checked={database === option.value}
              onChange={handleChange}
              name="database"
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default DatabaseSelector;
