// This is a manual mock for apiService.ts

// Explicitly define mocks for the functions you want to control
// Cast to JestMocks for TypeScript if needed, but createMockFromModule often handles this
const generateProjectZip = jest.fn();
const getProjectPreview = jest.fn();

// Export the mocked module members
export { generateProjectZip, getProjectPreview };