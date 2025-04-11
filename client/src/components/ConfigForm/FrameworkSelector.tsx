import { useConfigStore } from "../../store/useConfigStore";

function FrameworkSelector() {
  const framework = useConfigStore((state) => state.framework);
  const setFramework = useConfigStore((state) => state.setFramework);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFramework(event.target.value as "gin" | "echo");
  };

  const options = [
    { value: "gin", label: "Gin" },
    { value: "echo", label: "Echo" },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Web Framework
      </label>
      <div className="flex space-x-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              value={option.value}
              checked={framework === option.value}
              onChange={handleChange}
              name="framework"
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

export default FrameworkSelector;
