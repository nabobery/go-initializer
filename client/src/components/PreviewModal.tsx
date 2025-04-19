import React from "react";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import CodePreviewArea from "./CodePreview/CodePreviewArea";
import { ProjectPreview } from "../services/apiService";

// --- Modal Styling (Tailwind Focused) ---
const customStyles: Modal.Styles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000, // Ensure it's on top
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "static", // Override default absolute positioning
    inset: "auto", // Reset inset
    border: "none", // Remove default border
    background: "transparent", // Make modal content background transparent
    overflow: "visible", // Let content handle overflow
    borderRadius: "0", // Remove default border radius
    outline: "none",
    padding: "0",
    width: "90vw", // Use viewport width
    maxWidth: "1400px", // Max width
    height: "85vh", // Use viewport height
    display: "flex", // Use flex for internal layout
    flexDirection: "column",
  },
};

// Bind modal to your app element (for accessibility)
// In your main App.tsx or index.tsx, you might need:
// Modal.setAppElement('#root'); // Or your app's root element ID

interface PreviewModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  previewData: ProjectPreview | null;
  isLoading: boolean;
  error: string | null;
  projectName?: string;
}

function PreviewModal({
  isOpen,
  onRequestClose,
  previewData,
  isLoading,
  error,
  projectName,
}: PreviewModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Project Preview Modal"
      ariaHideApp={false} // Use if setAppElement is difficult, but setAppElement is preferred
    >
      {/* Modal Content Container with Background and Rounded Corners */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl flex flex-col h-full w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Code Preview{projectName ? `: ${projectName}` : ""}
          </h2>
          <button
            onClick={onRequestClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Code Preview Area takes remaining space */}
        <div className="flex-grow overflow-hidden">
          <CodePreviewArea
            previewData={previewData}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PreviewModal;
