import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border"
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Go Initializer
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400">
              Quickly scaffold your Go projects with best practices and modern
              tooling.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="https://github.com/yourusername/go-initializer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  GitHub Repository
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="/docs"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Documentation
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect
            </h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="https://twitter.com/yourusername"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Twitter
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="mailto:contact@example.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Contact
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {currentYear} Go Initializer. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
