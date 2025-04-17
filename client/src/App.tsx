import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { SignIn, SignUp, Protect } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import clerkAppearance from "./styles/clerkTheme";
import * as clerkThemes from "@clerk/themes";

export default function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    // If no saved value, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Update document class for dark mode
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
        <Header themeMode={themeMode} toggleThemeMode={toggleThemeMode} />

        <motion.main
          className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/sign-in/*"
                element={
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    appearance={{
                      ...clerkAppearance,
                      baseTheme:
                        themeMode === "dark"
                          ? clerkThemes.dark
                          : clerkThemes.experimental__simple,
                    }}
                  />
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    appearance={{
                      ...clerkAppearance,
                      baseTheme:
                        themeMode === "dark"
                          ? clerkThemes.dark
                          : clerkThemes.experimental__simple,
                    }}
                  />
                }
              />
              <Route
                path="/protected"
                element={
                  <Protect
                    condition={(isSignedIn) => !!isSignedIn}
                    fallback={
                      <p>
                        Please <Link to="/sign-in">sign in</Link> to view this
                        page.
                      </p>
                    }
                  >
                    <div>This page is protected.</div>
                  </Protect>
                }
              />
              {/* Add other routes here */}
            </Routes>
          </AnimatePresence>
        </motion.main>

        <Footer />
      </div>
    </Router>
  );
}
