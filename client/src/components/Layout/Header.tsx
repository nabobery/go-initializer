import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  themeMode: "light" | "dark";
  toggleThemeMode: () => void;
}

export default function Header({ themeMode, toggleThemeMode }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Go Initializer
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                onClick={toggleThemeMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {themeMode === "dark" ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon  className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={
            isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
          }
          className={`md:hidden overflow-hidden ${isOpen ? "block" : "hidden"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={toggleThemeMode}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}
