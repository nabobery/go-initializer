import { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { motion } from "framer-motion";

interface GoEditorProps {
  content: string | null; // File content or null if no file selected
  fileName?: string; // To help Monaco guess language
}

function GoEditor({ content, fileName }: GoEditorProps) {
  const [editorMounted, setEditorMounted] = useState(false);
  const [showFileName, setShowFileName] = useState(false);
  const monaco = useMonaco();

  // Determine language based on file extension
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
    : fileName?.endsWith(".js") || fileName?.endsWith(".jsx")
    ? "javascript"
    : fileName?.endsWith(".ts") || fileName?.endsWith(".tsx")
    ? "typescript"
    : fileName?.endsWith(".css")
    ? "css"
    : fileName?.endsWith(".html")
    ? "html"
    : "plaintext";

  // Show file name after editor is mounted
  useEffect(() => {
    if (editorMounted && fileName) {
      setShowFileName(true);
    } else {
      setShowFileName(false);
    }
  }, [editorMounted, fileName]);

  // Register a custom Monaco theme matching Tailwind dark/primary
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("tailwind-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6b7280" }, // gray-500
          { token: "keyword", foreground: "38bdf8" }, // primary-400
          { token: "string", foreground: "bae6fd" }, // primary-200
          { token: "number", foreground: "f472b6" }, // pink-400
          { token: "type", foreground: "0ea5e9" }, // primary-500
          { token: "function", foreground: "facc15" }, // yellow-400
        ],
        colors: {
          "editor.background": "#111827", // dark-bg
          "editor.foreground": "#e0f2fe", // primary-100
          "editor.lineHighlightBackground": "#1f2937",
          "editorLineNumber.foreground": "#374151",
          "editorCursor.foreground": "#38bdf8",
          "editor.selectionBackground": "#0ea5e955",
          "editor.inactiveSelectionBackground": "#0ea5e933",
          "editorIndentGuide.background": "#374151",
          "editorIndentGuide.activeBackground": "#38bdf8",
        },
      });
    }
  }, [monaco]);

  return (
    <motion.div 
      className="h-full w-full relative bg-gray-900 rounded-lg border border-gray-700 shadow-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* File name display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showFileName ? 1 : 0, y: showFileName ? 0 : -20 }}
        className="absolute top-0 left-0 right-0 z-10 px-4 py-2 bg-gray-900/80 backdrop-blur-sm text-primary-100 text-sm font-mono flex items-center border-b border-gray-700 shadow"
      >
        {fileName && (
          <>
            <span className="mr-2 text-primary-400">
              {language === "go" && (
                <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.001 12c0 6.628 5.372 12 12 12s12-5.372 12-12c0-6.627-5.372-12-12-12s-12 5.373-12 12zm18.241 1.224c-.145.222-.45.404-.88.548-.43.143-.97.219-1.617.219h-1.68v-3.982h1.587c.654 0 1.183.074 1.589.219.407.146.7.322.88.53.18.209.3.442.37.694.068.25.105.51.105.777 0 .292-.039.568-.105.825-.07.257-.196.494-.376.702l.127.268zm-17.722-.474l.914-3.5h1.296l.914 3.5h-1.296l-.149-.577h-.932l-.149.577h-1.296zm6.482 0l-.783-2.144h-.03l.031-1.356h1.091v3.5h-1.091zm10.297-2.366c-.039-.126-.097-.241-.182-.344-.084-.104-.2-.191-.341-.26-.139-.07-.328-.105-.563-.105h-.563v1.395h.563c.235 0 .424-.035.563-.105.142-.07.257-.156.341-.26.085-.104.143-.219.182-.345.042-.125.06-.255.06-.387 0-.132-.021-.264-.06-.389zm-14.985.747h.45l-.225-.93-.225.93zm12.151 7.925c.931-.2 1.156-1.259.354-1.653l-1.12-.555c-.494-.241-.406-.963.165-1.093l.422-.096c-.922-.692-2.326-1.211-3.662-1.459l-.633.422c-.365.243-.25.81.19.941 1.854.549 3.1 1.558 3.249 2.798l.005.073c.088.806-.471 1.5-1.299 1.616-1.246.175-2.334-.695-2.571-1.964l-1.105.312c.378 2.12 2.131 3.455 4.162 3.218 1.003-.117 1.842-.687 2.373-1.522.639-1.006.698-2.252.139-3.343-.596-1.178-1.659-1.952-2.804-2.211l-.138.627c1.031.223 1.852.849 2.296 1.749.374.76.314 1.687-.155 2.425-.3.474-.724.823-1.203.911-.765.14-1.582-.228-1.994-.981l-.494 1.991c.45.23.952.353 1.472.328.841-.039 1.598-.417 2.134-1.015l-.776-.603c-.19.242-.43.437-.707.506z"/>
                </svg>
              )}
            </span>
            <span className="flex-1 truncate">{fileName}</span>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
              language === "go" ? "bg-blue-600/30 text-blue-200" :
              language === "javascript" ? "bg-yellow-600/30 text-yellow-200" :
              language === "typescript" ? "bg-blue-600/30 text-blue-200" :
              language === "json" ? "bg-green-600/30 text-green-200" :
              language === "markdown" ? "bg-purple-600/30 text-purple-200" :
              "bg-gray-600/30 text-gray-200"
            }`}>
              {language}
            </span>
          </>
        )}
      </motion.div>

      <motion.div 
        className="h-full w-full border border-gray-700 rounded-lg overflow-hidden bg-gray-900"
        style={{ paddingTop: showFileName ? "40px" : "0" }}
        transition={{ duration: 0.3 }}
      >
        <Editor
          height="100%"
          language={language}
          theme={monaco ? "tailwind-dark" : "vs-dark"}
          value={content ?? "// Select a file from the tree to view its content"}
          onMount={() => setEditorMounted(true)}
          options={{
            readOnly: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            contextmenu: false,
            folding: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
          loading={
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full w-full"
            >
              <div className="flex flex-col items-center text-gray-400">
                <svg
                  className="animate-spin h-8 w-8 mb-2"
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
                <span className="text-sm">Loading editor...</span>
              </div>
            </motion.div>
          }
        />
      </motion.div>
    </motion.div>
  );
}

export default GoEditor;
