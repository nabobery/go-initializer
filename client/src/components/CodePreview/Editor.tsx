import Editor from "@monaco-editor/react";

interface GoEditorProps {
  content: string | null; // File content or null if no file selected
  fileName?: string; // To help Monaco guess language, though we force 'go'
}

function GoEditor({ content, fileName }: GoEditorProps) {
  // Determine language - default to go for .go files
  const language = fileName?.endsWith(".go")
    ? "go"
    : fileName?.endsWith(".mod")
    ? "go.mod"
    : fileName?.endsWith(".sum")
    ? "go.sum"
    : fileName?.endsWith(".md")
    ? "markdown"
    : fileName?.endsWith(".json")
    ? "json"
    : fileName?.endsWith(".yaml") || fileName?.endsWith(".yml")
    ? "yaml"
    : "plaintext";

  return (
    <div className="h-full w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={content ?? "// Select a file from the tree to view its content"}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          wordWrap: "on",
        }}
        loading={
          <div className="flex items-center justify-center h-full w-full">
            <svg
              className="animate-spin h-6 w-6 text-gray-400"
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
          </div>
        }
      />
    </div>
  );
}

export default GoEditor;
