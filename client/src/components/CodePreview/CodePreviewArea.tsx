import { useState, useEffect } from "react";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-400">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 text-center h-full flex items-center justify-center">
        Error loading preview: {error}
      </div>
    );
  }

  if (
    !previewData ||
    !previewData.structure ||
    previewData.structure.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full w-full p-2 text-center">
        <span className="text-gray-500 dark:text-gray-400">
          Preview will appear here.
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      {/* File Tree Column */}
      <div className="h-full w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-dark-card">
        <FileTree
          filePaths={previewData.structure}
          onSelectFile={setSelectedFile}
          initialSelectedFile={selectedFile}
        />
      </div>
      {/* Editor Column */}
      <div className="h-full flex-grow bg-gray-800">
        <GoEditor content={fileContent} fileName={selectedFile ?? undefined} />
      </div>
    </div>
  );
}

export default CodePreviewArea;
