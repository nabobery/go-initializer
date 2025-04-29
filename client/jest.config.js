/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest", // Use ts-jest for TypeScript transformation
  testEnvironment: "jsdom", // Use jsdom for a browser-like environment
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // File extensions Jest should look for
  roots: ["<rootDir>/src"], // Directories Jest should search for test files
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest", // Use ts-jest to transform .ts and .tsx files
      {
        tsconfig: "./tsconfig.app.json",
      },
    ],
  },
  // Optional: Setup file for jest-dom extensions
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  // setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // Optional: ModuleNameMapper for handling imports like CSS or assets if needed later
  // moduleNameMapper: {
  //   '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  //   '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  // },
  globals: {
    "import.meta": {
      // Mock import.meta for Vite environment variables
      env: {
        VITE_API_BASE_URL: "/api", // Provide a default value for the API base URL in tests
      },
    },
  },
};
