import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", "public/api-docs/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // {
  //   files: ["**/*.{ts,tsx}"],
  //   languageOptions: {
  //     ecmaVersion: 2020,
  //     globals: globals.browser,
  //   },
  // },
  reactHooks.configs["recommended-latest"],
  {
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
   // --- Config for .cjs files ---
   {
    files: ["*.config.cjs"], // Target only .cjs files at the root
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals (includes module, require, etc.)
      },
    },
  },
];
