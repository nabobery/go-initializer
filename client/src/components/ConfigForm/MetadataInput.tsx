import { useConfigStore } from "../../store/useConfigStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

function MetadataInput() {
  const modulePath = useConfigStore((state) => state.modulePath);
  const projectName = useConfigStore((state) => state.projectName);
  const setModulePath = useConfigStore((state) => state.setModulePath);

  const handleModulePathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModulePath(event.target.value);
  };

  const isModulePathValid =
    modulePath &&
    /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*$/.test(modulePath);

  return (
    <div className="space-y-4" id="metadata-input-group">
      <div className="flex items-center justify-between">
        <label
          htmlFor="module-path"
          className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2"
        >
          <CodeBracketIcon className="w-5 h-5 text-primary-500" />
          Project Metadata
        </label>
      </div>

      <div className="space-y-2">
        <div>
          <motion.div
            className="relative"
            initial={false}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.2 }}
          >
            <input
              required
              id="module-path"
              type="text"
              value={modulePath}
              onChange={handleModulePathChange}
              placeholder="e.g., github.com/your-username/your-project"
              aria-invalid={!isModulePathValid && modulePath.length > 0}
              aria-describedby={
                !isModulePathValid ? "module-path-error" : undefined
              }
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-white transition-colors ${
                !isModulePathValid && modulePath.length > 0
                  ? "border-red-500 dark:border-red-500"
                  : isModulePathValid && modulePath.length > 0
                  ? "border-green-500 dark:border-green-500"
                  : "border-gray-200 dark:border-dark-border"
              }`}
            />
            <div className="absolute top-0 bottom-0 right-4 flex items-center pointer-events-none">
              <AnimatePresence>
                {modulePath.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    {isModulePathValid ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence>
            {!isModulePathValid && modulePath.length > 0 && (
              <motion.p
                id="module-path-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <ExclamationCircleIcon className="w-4 h-4" />
                Invalid format (e.g., domain/user/repo)
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Used for{" "}
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              go mod init {modulePath || "<module-path>"}
            </code>
          </motion.p>
        </div>

        <motion.div
          className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between">
            <span>Project Name:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {projectName || "<Enter Module Path>"}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default MetadataInput;
