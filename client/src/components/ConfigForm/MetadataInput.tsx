import { useConfigStore } from "../../store/useConfigStore";

function MetadataInput() {
  const modulePath = useConfigStore((state) => state.modulePath);
  const projectName = useConfigStore((state) => state.projectName);
  const setModulePath = useConfigStore((state) => state.setModulePath);
  // const setProjectName = useConfigStore((state) => state.setProjectName); // Only set via module path for simplicity now

  const handleModulePathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModulePath(event.target.value);
  };

  // Basic validation example - could add more complex regex or feedback
  const isModulePathValid =
    modulePath &&
    /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*$/.test(modulePath);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Project Metadata
      </label>
      <div className="space-y-2">
        <div className="relative">
          <input
            required
            id="module-path"
            type="text"
            value={modulePath}
            onChange={handleModulePathChange}
            placeholder="e.g., github.com/your-username/your-project"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:border-dark-border dark:text-white ${
              !isModulePathValid && modulePath.length > 0
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {!isModulePathValid && modulePath.length > 0 && (
            <p className="mt-1 text-sm text-red-500">
              Invalid format (e.g., domain/user/repo)
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Used for 'go mod init {modulePath || "<module-path>"}'
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Project Name (derived):{" "}
            <strong className="text-gray-900 dark:text-white">
              {projectName || "<Enter Module Path>"}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MetadataInput;
