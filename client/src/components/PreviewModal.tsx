import React from "react";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import CodePreviewArea from "./CodePreview/CodePreviewArea";
import { ProjectPreview } from "../services/apiService";
import { motion, AnimatePresence } from "framer-motion";

// --- Modal Styling (Tailwind Focused) ---
const customStyles: Modal.Styles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000, // Ensure it's on top
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col h-full w-full overflow-hidden border border-gray-200 dark:border-gray-800 backdrop-blur-lg"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
          >
            {/* Modal Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-primary-50/80 via-white/80 to-gray-100/80 dark:from-dark-bg/80 dark:via-dark-card/80 dark:to-gray-900/80"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-200 rounded px-2 py-0.5 text-base font-mono tracking-tight">
                  Code Preview
                </span>
                {projectName && (
                  <span className="text-base font-normal text-gray-500 dark:text-gray-300 ml-2 truncate max-w-xs" title={projectName}>
                    {projectName}
                  </span>
                )}
              </h2>
              <motion.button
                onClick={onRequestClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Close modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>

            {/* Code Preview Area takes remaining space */}
            <motion.div
              className="flex-grow overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <CodePreviewArea
                previewData={previewData}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default PreviewModal;
