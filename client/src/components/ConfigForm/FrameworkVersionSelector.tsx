import { useConfigStore } from "../../store/useConfigStore";
import { CubeIcon } from "@heroicons/react/24/outline";

function FrameworkVersionSelector() {
  const framework = useConfigStore((state) => state.framework);
  const frameworkVersion = useConfigStore((state) => state.frameworkVersion);
  const setFrameworkVersion = useConfigStore(
    (state) => state.setFrameworkVersion
  );
  const availableVersions = useConfigStore((state) => state.availableVersions);

  if (!framework || !availableVersions?.frameworks[framework]) {
    return null;
  }

  const frameworkVersions =
    availableVersions.frameworks[framework]?.versions || [];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFrameworkVersion(event.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CubeIcon className="w-5 h-5 text-primary-500" />
        <label
          htmlFor="framework-version"
          className="block text-base font-medium text-gray-900 dark:text-white"
        >
          {framework.charAt(0).toUpperCase() + framework.slice(1)} Version
        </label>
      </div>

      <select
        id="framework-version"
        value={frameworkVersion}
        onChange={handleChange}
        className="block w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        {frameworkVersions.map((version) => (
          <option key={version.version} value={version.version}>
            {version.label}
            {version.isRecommended ? " (Recommended)" : ""}
          </option>
        ))}
      </select>

      {frameworkVersions.find((v) => v.version === frameworkVersion)
        ?.releaseDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Released:{" "}
          {
            frameworkVersions.find((v) => v.version === frameworkVersion)
              ?.releaseDate
          }
        </p>
      )}
    </div>
  );
}

export default FrameworkVersionSelector;
