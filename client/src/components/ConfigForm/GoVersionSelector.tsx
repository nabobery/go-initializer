import { useConfigStore } from "../../store/useConfigStore";
import { useEffect } from "react";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

function GoVersionSelector() {
  const goVersion = useConfigStore((state) => state.goVersion);
  const setGoVersion = useConfigStore((state) => state.setGoVersion);
  const availableVersions = useConfigStore((state) => state.availableVersions);
  const fetchVersions = useConfigStore((state) => state.fetchVersions);
  const versionsLoading = useConfigStore((state) => state.versionsLoading);

  // Fetch versions on component mount
  useEffect(() => {
    if (!availableVersions && !versionsLoading) {
      fetchVersions();
    }
  }, [availableVersions, versionsLoading, fetchVersions]);

  const goVersions = availableVersions?.go.versions || [];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGoVersion(event.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CodeBracketIcon className="w-5 h-5 text-primary-500" />
        <label
          htmlFor="go-version"
          className="block text-base font-medium text-gray-900 dark:text-white"
        >
          Go Version
        </label>
      </div>

      <select
        id="go-version"
        value={goVersion}
        onChange={handleChange}
        disabled={versionsLoading}
        className="block w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
      >
        {versionsLoading ? (
          <option>Loading versions...</option>
        ) : (
          goVersions.map((version) => (
            <option key={version.version} value={version.version}>
              {version.label}
              {version.isRecommended ? " (Recommended)" : ""}
            </option>
          ))
        )}
      </select>

      {goVersions.find((v) => v.version === goVersion)?.releaseDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Released:{" "}
          {goVersions.find((v) => v.version === goVersion)?.releaseDate}
        </p>
      )}
    </div>
  );
}

export default GoVersionSelector;
