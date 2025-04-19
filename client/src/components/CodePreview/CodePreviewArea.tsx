import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileTree from "./FileTree";
import GoEditor from "./Editor";
import { ProjectPreview } from "../../services/apiService";

interface CodePreviewAreaProps {
  previewData: ProjectPreview | null;
  isLoading?: boolean;
  error?: string | null;
}

function CodePreviewArea({
  previewData,
  isLoading,
  error,
}: CodePreviewAreaProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(
    "// Select a file from the tree to view its content"
  );
  const [isResizing, setIsResizing] = useState(false);
  const [splitWidth, setSplitWidth] = useState(25); // Default 25% width for file tree

  // Effect to update editor content when selected file or preview data changes
  useEffect(() => {
    if (selectedFile && previewData?.files) {
      setFileContent(
        previewData.files[selectedFile] ??
          "// File content not found or unable to load"
      );
    } else if (!selectedFile) {
      // Reset editor if no file is selected (e.g., after new preview load)
      setFileContent("// Select a file from the tree to view its content");
    }
  }, [selectedFile, previewData]);

  // Effect to reset selection when new preview data comes in
  useEffect(() => {
    setSelectedFile(null); // Reset selection when data changes
    // Optionally select a default file like 'cmd/.../main.go' if previewData exists?
    // if (previewData?.structure?.includes('cmd/your-project/main.go')) {
    //     setSelectedFile('cmd/your-project/main.go');
    // }
  }, [previewData]);

  // Handle resize functionality
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById("code-preview-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newWidth =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setSplitWidth(Math.max(15, Math.min(40, newWidth)));
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-full w-full text-gray-400 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-dark-bg dark:via-dark-card dark:to-gray-900 rounded-lg shadow-lg"
      >
        <svg
          className="animate-spin h-6 w-6 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading Preview...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 text-red-600 dark:text-red-400 text-center h-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-100 dark:from-red-900/20 dark:via-dark-card dark:to-gray-900 rounded-lg shadow-lg"
      >
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg shadow">
          <svg
            className="w-8 h-8 mx-auto mb-2 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Error loading preview: {error}
        </div>
      </motion.div>
    );
  }

  if (
    !previewData ||
    !previewData.structure ||
    previewData.structure.length === 0
  ) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full w-full p-2 text-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-dark-bg dark:via-dark-card dark:to-gray-900 rounded-lg shadow-lg"
      >
        <span className="text-gray-500 dark:text-gray-400 animate-pulse">
          Preview will appear here.
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      id="code-preview-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full w-full rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-bg dark:via-dark-card dark:to-gray-900"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
    >
      {/* File Tree Column */}
      <motion.div
        className="h-full border-r border-gray-200 dark:border-dark-border flex-shrink-0 bg-white dark:bg-dark-card rounded-l-lg overflow-hidden"
        style={{ width: `${splitWidth}%` }}
        layout
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="file-tree"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <FileTree
              filePaths={previewData.structure}
              onSelectFile={setSelectedFile}
              initialSelectedFile={selectedFile}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Resizer */}
      <div
        className={`w-1 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-primary-400 dark:hover:bg-primary-600 active:bg-primary-500 dark:active:bg-primary-500 transition-colors ${
          isResizing ? "bg-primary-500 dark:bg-primary-500" : ""
        }`}
        onMouseDown={startResize}
        style={{ zIndex: 10 }}
      />

      {/* Editor Column */}
      <motion.div
        className="h-full flex-grow bg-gray-800 rounded-r-lg overflow-hidden"
        style={{ width: `${100 - splitWidth}%` }}
        layout
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFile || "no-selection"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <GoEditor
              content={fileContent}
              fileName={selectedFile ?? undefined}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default CodePreviewArea;
